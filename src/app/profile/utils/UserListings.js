import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { deleteListingFromFirestore } from "@/utils/firestoreUtils";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import CreateListingModal from "./CreateListingModal";
import { FaPlus } from "react-icons/fa";

export default function UserListings({ userId, onCreateListing }) {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsQuery = query(
        collection(db, "listings"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const listingsSnapshot = await getDocs(listingsQuery);
      setListings(
        listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchUserListings();
  }, [userId]);

  const handleDelete = async (listingId) => {
    try {
      await deleteListingFromFirestore(listingId);
      setListings(listings.filter((listing) => listing.id !== listingId));
      console.log("Listing successfully deleted");
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleEdit = (listingId) => {
    console.log("Editing listing with ID:", listingId);
    router.push(`/edit-listing?listingId=${listingId}`);
  };

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Listings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your current listings or create a new one.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          aria-label="Create New Listing"
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {listings.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            You don&apos;t have any listings yet.
          </p>
        )}
      </div>
      {/* Link to view all listings */}

      <div className="mt-8 text-center">
        {listings.length > 0 && (
          <Link
            href="/all-listings"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            See All Listings
          </Link>
        )}
      </div>
      <br />

      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
