import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Pencil, Trash2 } from "lucide-react";
import { deleteListingFromFirestore } from "@/utils/firestoreUtils";
import { auth, db } from "@/firebase";
import ContactProfileButtons from "./ContactProfileButtons";
import ContactModal from "./ContactModal";
import ImageGallery from "./ProductsGallery";
import { FaTag, FaMapMarkerAlt } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Button } from "@/components/Button";

const ProductsListingPage = ({ listing }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const isOwnListing = user && user.uid === listing?.userId;
  const imageUrls =
    listing?.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls
      : null;

  useEffect(() => {
    setLoading(true);
    const fetchContacts = async () => {
      if (listing && listing.userId) {
        try {
          const contactsQuery = query(
            collection(db, "contacts"),
            where("userId", "==", listing.userId)
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
  }, [listing]);

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
    if (!isOwnListing || !listing) return;
    try {
      await deleteListingFromFirestore(listing.id);
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
    router.push(`/edit-listing?listingId=${listing.id}`);
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

        <div className="px-6 py-8 space-y-6 bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {listing?.name || "Product Name"}
          </h2>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-green-600">
              <FaTag className="text-xl" />
              <span className="text-2xl font-bold">
                {listing?.price || "N/A"}
                {" " + getCurrency(listing?.currency)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-lg">
                {listing?.location || "Location not specified"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {listing?.description || "Product Description"}
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-blue-800">
              Additional Details
            </h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <span className="ml-2 text-gray-800">
                  {listing?.category || "Unknown"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Condition:</span>
                <span className="ml-2 text-gray-800">
                  {listing?.condition || "Not specified"}
                </span>
              </div>
              {/* Add more details as needed */}
            </div>
          </div>
          <div className="mt-6">
            {!isOwnListing && (
              <ContactProfileButtons
                listing={listing}
                setIsContactModalOpen={setIsContactModalOpen}
              />
            )}
            {isOwnListing && (
              <div className="flex space-x-2">
                <Button onClick={handleEdit} variant="white">
                  <Pencil size={20} className="inline-block mr-2" />
                  Edit
                </Button>
                <Button onClick={() => setIsConfirmOpen(true)} variant="red">
                  <Trash2 size={20} className="inline-block mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contacts={contacts}
        listingOwnerId={listing?.userId}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        listingTitle={listing ? listing.name : ""}
      />
    </div>
  );
};

export default ProductsListingPage;
