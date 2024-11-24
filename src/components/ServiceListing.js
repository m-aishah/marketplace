import { Pencil, Trash2, Share2, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaCalendar,
  FaMapMarkerAlt,
  FaTools,
} from "react-icons/fa";
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: skill.name,
          text: skill.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!skill || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {isOwnListing && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTools className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You are viewing your own service listing
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="p-6">
              {skill.imageUrls && skill.imageUrls.length > 0 && (
                <ImageGallery images={skill.imageUrls} />
              )}
            </div>

            {/* Right Column - Service Details */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {skill.name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {skill.category}
                </span> */}
                 <div className="flex items-center space-x-2 text-gray-600">
                  <FaMapMarkerAlt className="flex-shrink-0" />
                  <span>{skill?.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {skill.paymentType}
                </span>
                <div className="flex items-center text-2xl font-bold flex-wrap text-green-600">
                  {skill?.price? getCurrency(skill?.currency) : null}
                  {skill?.price || "Nigotiable"}
                </div>

             
              </div>

              <div className="bg-white border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {skill.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaBriefcase className="text-xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="text-sm">{skill?.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaCalendar className="text-xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Listed On</p>
                    <p className="text-sm">
                      {new Date(skill.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {!isOwnListing ? (
                  <ContactProfileButtons
                    listing={skill}
                    setIsContactModalOpen={setIsContactModalOpen}
                  />
                ) : (
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleEdit}
                      variant="white"
                      className="flex-1 flex items-center justify-center"
                    >
                      <Pencil size={20} className="mr-2" />
                      Edit Service
                    </Button>
                    <Button
                      onClick={() => setIsConfirmOpen(true)}
                      variant="red"
                      className="flex-1 flex items-center justify-center"
                    >
                      <Trash2 size={20} className="mr-2" />
                      Delete Service
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
