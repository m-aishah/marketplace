import { useState, useEffect } from "react";
import { FaBed, FaBath, FaHome } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import QuickView from "./QuickView";
import ContactModal from "./ContactModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { deleteListingFromFirestore } from "@/utils/firestoreUtils";
import { auth, db } from "@/firebase";
import ContactProfileButtons from "./ContactProfileButtons";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import ImageGallery from "./GoodsGallery";

const ApartmentListingPage = ({ apartment }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const isOwnListing = user && user.uid === apartment?.userId;
  const imageUrls = apartment?.imageUrls || [];

  useEffect(() => {
    setLoading(true);
    const fetchContacts = async () => {
      if (apartment && apartment.userId) {
        try {
          const contactsQuery = query(
            collection(db, "contacts"),
            where("userId", "==", apartment.userId)
          );
          const contactsSnapshot = await getDocs(contactsQuery);
          setContacts(
            contactsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        } catch (error) {
          console.error("Error fetching contact information:", error);
        }
      }
    };

    fetchContacts();
    setLoading(false);
  }, [apartment]);

  const getCurrency = (currency) => {
    switch (currency) {
      case "TL":
        return "₺";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };

  const handleDelete = async () => {
    if (!isOwnListing || !apartment) return;
    try {
      await deleteListingFromFirestore(apartment.id);
      toast.success("Listing successfully deleted");
      router.push("/");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const handleEdit = () => {
    router.push(`/edit-listing?listingId=${apartment.id}`);
    setLoading(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {isOwnListing && (
        <div
          className="max-w-4xl mt-6 mx-auto bg-blue-100 rounded-t-lg border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Note:</p>
          <p>You are viewing your own listing.</p>
        </div>
      )}
      <div
        className={`max-w-4xl mx-auto mb-6 bg-white shadow-md overflow-hidden
          ${isOwnListing ? "rounded-b-lg" : "rounded-lg mt-6"}`}
      >
        <div className="p-6">
          {imageUrls && <ImageGallery images={imageUrls} />}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">
              {apartment?.name || "No Title"}
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            {apartment?.location || "No Location"}
          </p>
          <p className="mt-2 text-green-600 text-xl">
            {apartment?.price || "N/A"}
            {" " + getCurrency(apartment?.currency)}
          </p>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Amenities:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2 pl-6">
              <p className="flex items-center">
                <FaHome className="mr-2" /> {apartment?.category || "Unknown"}
              </p>
              <p className="flex items-center">
                <FaBed className="mr-2" /> {apartment?.bedrooms} Bedrooms
              </p>
              <p className="flex items-center">
                <FaBath className="mr-2" /> {apartment?.bathrooms} Bathrooms
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Description:</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {apartment?.description || "No description available"}
            </p>
          </div>
          <div className="container mx-auto p-4">
            <QuickView quickViewData={apartment} />
          </div>
          <div className="mt-6">
            {!isOwnListing && (
              <ContactProfileButtons
                listing={apartment}
                setIsContactModalOpen={setIsContactModalOpen}
              />
            )}
            {isOwnListing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="transition font-medium text-sm rounded-full text-center bg-brand text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80 px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center"
                >
                  <Pencil size={20} className="inline-block mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="transition font-medium text-sm rounded-full text-center bg-red-600 text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-red-600/80 px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center"
                >
                  <Trash2 size={20} className="inline-block mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          contacts={contacts}
          listingOwnerId={apartment?.userId}
        />
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          listingTitle={apartment ? apartment.name : ""}
        />
      </div>
    </div>
  );
};

export default ApartmentListingPage;
