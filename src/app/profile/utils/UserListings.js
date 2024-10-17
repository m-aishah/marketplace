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
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "react-toastify";

export default function UserListings({ userId, isOwnProfile }) {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserListings = async () => {
      let listingsQuery = query(
        collection(db, "listings"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      if (isOwnProfile) {
        listingsQuery = query(listingsQuery, limit(3));
      }
      const listingsSnapshot = await getDocs(listingsQuery);
      setListings(
        listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchUserListings();
  }, [userId, isOwnProfile]);

  const handleDelete = async () => {
    if (!isOwnProfile || !listingToDelete) return;
    try {
      await deleteListingFromFirestore(listingToDelete.id);
      setListings(
        listings.filter((listing) => listing.id !== listingToDelete.id)
      );
      toast.success("Listing successfully deleted");
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      setIsConfirmOpen(false);
      setListingToDelete(null);
    }
  };

  const openConfirmModal = (listing) => {
    setListingToDelete(listing);
    setIsConfirmOpen(true);
  };

  const handleEdit = (listingId) => {
    if (!isOwnProfile) return;
    console.log("Editing listing with ID:", listingId);
    router.push(`/edit-listing?listingId=${listingId}`);
    setLoading(true);
  };

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isOwnProfile ? "Your Listings" : "User Listings"}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isOwnProfile
              ? "Manage your current listings or create a new one."
              : "View this user's listings."}
          </p>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            aria-label="Create New Listing"
          >
            <FaPlus className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={() => openConfirmModal(listing)}
              onEdit={isOwnProfile ? handleEdit : undefined}
            />
          ))}
        </div>

        {listings.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {isOwnProfile
              ? "You don't have any listings yet."
              : "This user doesn't have any listings yet."}
          </p>
        )}
      </div>
      {isOwnProfile && (
        <div className="mt-8 text-center">
          {listings.length > 0 && (
            <Link
              href={isOwnProfile ? "/all-listings" : `/all-listings/${userId}`}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
            >
              See All Listings
            </Link>
          )}
        </div>
      )}
      <br />

      {isOwnProfile && (
        <CreateListingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        listingTitle={listingToDelete ? listingToDelete.name : ""}
      />
    </div>
  );
}
