import { useState, useEffect } from "react";
import { FaBed, FaBath, FaHome } from "react-icons/fa";
import QuickView from "./QuickView";
import Image from "next/image";
import ContactModal from "./ContactModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const ApartmentListingPage = ({ apartment }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const imageUrls = apartment?.imageUrls || [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  useEffect(() => {
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
  }, [apartment]);

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      {imageUrls.length > 0 && (
        <div className="relative">
          <Image
            src={imageUrls[currentImage]}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="Apartment"
            className="object-cover w-full h-64"
          />
          <button
            className="absolute top-1/2 left-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            onClick={prevImage}
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            onClick={nextImage}
          >
            &#10095;
          </button>
        </div>
      )}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {apartment?.name || "No Title"}
        </h1>
        <p className="mt-2 text-gray-600">
          {apartment?.location || "No Location"}
        </p>
        <p className="mt-2 text-green-600 text-xl">
          ${apartment?.price || "Price Not Available"}
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
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none"
            onClick={() => setIsContactModalOpen(true)}
          >
            Contact Advertiser
          </button>
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

export default ApartmentListingPage;
