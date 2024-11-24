import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Pencil, Trash2, Share2, Heart } from "lucide-react";
import {
  deleteListingFromFirestore,
  fetchLikeStatusFromFirestore,
  likeListingInFirestore,
  unlikeListingInFirestore,
} from "@/utils/firestoreUtils";
import { auth, db } from "@/firebase";
import ContactProfileButtons from "./ContactProfileButtons";
import ContactModal from "./ContactModal";
import ImageGallery from "./ProductsGallery";
import {
  FaTag,
  FaMapMarkerAlt,
  FaCalendar,
  FaCheckCircle,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Button } from "@/components/Button";
import BackButton from "./BackButton";

const ProductsListingPage = ({ listing }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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

    const fetchLikeStatus = async () => {
      if (user && listing?.id) {
        setIsLiked(
          await fetchLikeStatusFromFirestore({
            listingId: listing.id,
            userId: user.uid,
          })
        );
      }
    };

    fetchContacts();
    fetchLikeStatus();
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

  const handleLike = async () => {
    if (!user) return;

    try {
      await likeListingInFirestore({ listingId: listing.id, userId: user.uid });
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking listing:", error);
    }
  };

  const handleUnlike = async () => {
    if (!user) return;

    try {
      await unlikeListingInFirestore({
        listingId: listing.id,
        userId: user.uid,
      });
      setIsLiked(false);
    } catch (error) {
      console.error("Error unliking listing:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listing.name,
          text: listing.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <LoadingSpinner />;

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
                <FaCheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You are viewing your own listing
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="p-6">
              {imageUrls && <ImageGallery images={imageUrls} />}
            </div>

            {/* Right Column - Product Details */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {listing?.name}
                </h1>
                <div className="flex space-x-2">
                  {user && (
                    <button
                      onClick={isLiked ? handleUnlike : handleLike}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {listing?.condition}
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center text-2xl font-bold flex-wrap text-green-600">
                  {getCurrency(listing?.currency)}
                  {listing?.price}
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaMapMarkerAlt className="flex-shrink-0" />
                  <span>{listing?.location}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {listing?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaTag className="text-xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="text-sm">{listing?.brand || "N/A"}</p>
                  </div>
                </div>
                <div className="flex isFavitems-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaCalendar className="text-xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Listed On</p>
                    <p className="text-sm">
                      {new Date(listing?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {!isOwnListing ? (
                  <ContactProfileButtons
                    listing={listing}
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
                      Edit Listing
                    </Button>
                    <Button
                      onClick={() => setIsConfirmOpen(true)}
                      variant="red"
                      className="flex-1 flex items-center justify-center"
                    >
                      <Trash2 size={20} className="mr-2" />
                      Delete Listing
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
