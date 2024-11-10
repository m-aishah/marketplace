import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaTag, FaTools } from "react-icons/fa";
import ImageGallery from "./ProductsGallery";
import ContactModal from "./ContactModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { deleteListingFromFirestore } from "@/utils/firestoreUtils";
import { auth, db } from "@/firebase";
import ContactProfileButtons from "./ContactProfileButtons";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import BackButton from "./BackButton";

const FreelancerServicePage = ({ skill }) => {
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const isOwnListing = user && user.uid === skill?.userId;

  useEffect(() => {
    setLoading(true);
    const fetchContacts = async () => {
      if (skill && skill.userId) {
        try {
          const contactsQuery = query(
            collection(db, "contacts"),
            where("userId", "==", skill.userId)
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
  }, [skill]);

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
    if (!isOwnListing || !skill) return;
    try {
      await deleteListingFromFirestore(skill.id);
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
    router.push(`/edit-listing?listingId=${skill.id}`);
    setLoading(true);
  };

  if (!skill || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
   
      {isOwnListing && (
        <div className="max-w-4xl mt-6 mx-auto bg-blue-100 rounded-t-lg border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Note:</p>
          <p>You are viewing your own listing.</p>
        </div>
      )}
      
      <div className={`max-w-4xl mx-auto mb-6 bg-white shadow-md overflow-hidden ${isOwnListing ? "rounded-b-lg" : "rounded-lg mt-6"}`}>
      <BackButton />
        <div className="p-6">
          {skill.imageUrls && skill.imageUrls.length > 0 && (
            <ImageGallery images={skill.imageUrls} />
          )}
        </div>

        <div className="px-6 py-8 space-y-6 bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {skill.name}
          </h2>

          {/* Price and Location */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-green-600">
              <FaTag className="text-xl" />
              <span className="text-2xl font-bold">
                {skill.price || "N/A"}
                {" " + getCurrency(skill.currency)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-lg">{skill.location}</span>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{skill.description}</p>
          </div>

          {/* Additional Details */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Service Details</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FaBriefcase className="text-blue-500" />
                <span className="font-medium text-gray-600">Payment Type:</span>
                <span className="text-gray-800">{skill.paymentType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaTools className="text-blue-500" />
                <span className="font-medium text-gray-600">Category:</span>
                <span className="text-gray-800">{skill.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-blue-500" />
                <span className="font-medium text-gray-600">Listed on:</span>
                <span className="text-gray-800">
                  {new Date(skill.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            {!isOwnListing && (
              <ContactProfileButtons
                listing={skill}
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
        listingOwnerId={skill?.userId}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        listingTitle={skill ? skill.name : ""}
      />
    </div>
  );
};

export default FreelancerServicePage;