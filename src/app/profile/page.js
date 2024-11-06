"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProfileHeader from "./utils/ProfileHeader";
import UserListings from "./utils/UserListings";
import TransactionHistory from "./utils/TransactionHistory";
import ContactInformation from "./utils/ContactInformation";
import LoadingSpinner from "@/components/LoadingSpinner";
import BackButton from "@/components/BackButton";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = { id: currentUser.uid, ...userDoc.data() };
            setUser(userData);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      {user ? (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <BackButton />
          <ProfileHeader
            user={user}
            onUpdate={handleProfileUpdate}
            isOwnProfile={true}
          />

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "listings"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("listings")}
                >
                  Listings
                </button>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "transactions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transactions
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "contact"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("contact")}
                >
                  Contact Details
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "listings" && (
            <UserListings userId={user.id} isOwnProfile={true} />
          )}

          {activeTab === "transactions" && (
            <TransactionHistory userId={user.id} />
          )}

          {activeTab === "contact" && (
            <ContactInformation userId={user.id} isOwnProfile={true} />
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </ProtectedRoute>
  );
}

export default Profile;
