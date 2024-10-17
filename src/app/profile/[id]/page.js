"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProfileHeader from "../utils/ProfileHeader";
import UserListings from "../utils/UserListings";
import ContactInformation from "../utils/ContactInformation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams } from "next/navigation";

function UserProfile() {
  const [user] = useAuthState(auth);
  const [fetchedUser, setfetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() };
          setfetchedUser(userData);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!fetchedUser) {
    return <div>User not found</div>;
  }

  return (
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
      <ProfileHeader user={fetchedUser} isOwnProfile={false} />

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
        <UserListings userId={fetchedUser.id} isOwnProfile={false} />
      )}
      {activeTab === "contact" &&
        (user ? (
          <ContactInformation userId={fetchedUser.id} isOwnProfile={false} />
        ) : (
          <div className="text-center text-gray-800 py-4">
            Please log in to view contact options.
          </div>
        ))}
    </div>
  );
}

export default UserProfile;
