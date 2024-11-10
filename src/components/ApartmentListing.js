import { useState, useEffect } from "react";
import { FaBed, FaBath, FaHome, FaMoneyBill, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
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
import ImageGallery from "./ProductsGallery";
import { Button } from "@/components/Button";
import BackButton from "./BackButton";

const ApartmentListingPage = ({ apartment }) => {
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
      if (apartment?.userId) {
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
        <div className="max-w-4xl mt-6 mx-auto bg-blue-100 rounded-t-lg border-l-4 border-blue-500 text-blue-700 p-4">
          <p className="font-bold">Note:</p>
          <p>You are viewing your own listing.</p>
        </div>
      )}
      <div className={`max-w-4xl mx-auto mb-6 bg-white shadow-md overflow-hidden
        ${isOwnListing ? "rounded-b-lg" : "rounded-lg mt-6"}`}>
        
        <div className="p-6">
        <BackButton />
          {imageUrls && <ImageGallery images={imageUrls} />}
        </div>

        <div className="px-6 py-8 space-y-6 bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {apartment?.name || "Apartment Name"}
          </h2>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-green-600">
              <FaMoneyBill className="text-xl" />
              <span className="text-2xl font-bold">
                {apartment?.price || "N/A"}
                {" " + getCurrency(apartment?.currency)}
                <span className="text-sm text-gray-600 ml-1">/ {apartment?.paymentType}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-lg">
                {apartment?.location || "Location not specified"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {apartment?.description || "No description available"}
            </p>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 text-gray-700">
                <FaHome className="text-xl text-blue-600" />
                <div>
                  {/* <p className="text-sm text-gray-500">Type</p> */}
                  <p className="font-medium">{apartment?.category || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBed className="text-xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{apartment?.bedrooms || "0"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBath className="text-xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{apartment?.bathrooms || "0"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaCalendarAlt className="text-xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Listed On</p>
                  <p className="font-medium">
                    {new Date(apartment?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
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
        listingOwnerId={apartment?.userId}
      />
      
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        listingTitle={apartment ? apartment.name : ""}
      />
    </div>
  );
};

export default ApartmentListingPage;