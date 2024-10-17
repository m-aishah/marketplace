"use client";

import { Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaBriefcase, FaUserAlt, FaCalendar } from "react-icons/fa";
import Image from "next/image";
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

  const getCurrency = (cuurency) => {
    switch (cuurency) {
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
        <div
          className="max-w-4xl mt-6 mx-auto bg-blue-100 rounded-t-lg border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Note:</p>
          <p>You are viewing your own listing.</p>
        </div>
      )}
      <div
        className={`container max-w-4xl mb-6 mx-auto p-6 bg-white shadow-lg" +
          ${isOwnListing ? "rounded-b-lg" : "rounded-lg mt-6"}`}
      >
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 p-4 rounded-full text-white">
            <FaUserAlt size={40} />
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800">{skill.name}</h1>
            <p className="text-gray-600">Professional Freelancer</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Service Offered
        </h2>
        <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50 shadow-md">
          <div className="flex items-center mb-4">
            <FaBriefcase className="text-blue-500 text-2xl" />
            <h3 className="text-xl font-bold text-gray-800 ml-3">
              {skill.serviceTitle}
            </h3>
          </div>
          <p className="text-gray-700 text-lg mb-3">{skill.description}</p>
          <p className="text-gray-600 mb-2">Category: {skill.category}</p>
          <p className="text-gray-600 mb-2">Service: {skill.service}</p>
          <p className="text-gray-600 mb-3">Details: {skill.serviceDetails}</p>
          <p className="text-xl font-bold text-blue-500 mb-1">
            Price: {skill?.price || "N/A"}
            {" " + getCurrency(skill?.currency)}
          </p>
          <div className="flex items-center text-gray-500 mt-4">
            <FaCalendar className="mr-2" />
            <p>Listed on: {new Date(skill.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {skill.imageUrls && skill.imageUrls.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Service Images:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skill.imageUrls.map((url, index) => (
                <div key={index} className="relative h-60">
                  <Image
                    src={url}
                    alt={`Service Image ${index + 1}`}
                    layout="fill"
                    className="rounded-lg shadow-lg object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
};

export default FreelancerServicePage;
