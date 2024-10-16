import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import ContactModal from "./ContactModal";
import ImageGallery from "./GoodsGallery";
import { FaTag, FaMapMarkerAlt, FaUser, FaPhoneAlt } from 'react-icons/fa';

const GoodsListingPage = ({ listing }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const imageUrls =
    listing?.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls
      : null;

  useEffect(() => {
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
  }, [listing]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
              <span className="text-2xl font-bold">₺{listing?.price || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-lg">{listing?.location || "Location not specified"}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {listing?.description || "Product Description"}
            </p>
          </div>

      

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-blue-800">Additional Details</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <span className="ml-2 text-gray-800">{listing?.category || "Unknown"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Condition:</span>
                <span className="ml-2 text-gray-800">{listing?.condition || "Not specified"}</span>
              </div>
              {/* Add more details as needed */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="transition bg-blue-600 font-medium text-white px-6 py-3 rounded-full text-sm hover:bg-blue-700 hover:shadow-lg flex items-center justify-center"
            >
              <FaPhoneAlt className="mr-2" />
              Contact Advertiser
            </button>
            <Link
              href={`/profile/${listing?.userId}`}
              className="transition bg-gray-200 font-medium text-gray-800 px-6 py-3 rounded-full text-sm hover:bg-gray-300 hover:shadow-lg flex items-center justify-center"
            >
              <FaUser className="mr-2" />
              Advertiser Profile
            </Link>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contacts={contacts}
      />
    </div>
  );
};

export default GoodsListingPage;