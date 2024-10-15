"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProfileHeader from "./utils/ProfileHeader";
import UserListings from "./utils/UserListings";
import TransactionHistory from "./utils/TransactionHistory";
import ContactInformation from "./utils/ContactInformation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const router = useRouter();

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

  if (!user) {
    return router.push("/login");
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
        <ProfileHeader user={user} onUpdate={handleProfileUpdate} />

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

        {activeTab === "contact" && <ContactInformation userId={user.id} />}

        {activeTab === "listings" && <UserListings userId={user.id} />}

        {activeTab === "transactions" && (
          <TransactionHistory userId={user.id} />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default Profile;
