"use client";

import React, { useState, useEffect } from "react";
import { FaBriefcase, FaUserAlt, FaCalendar } from "react-icons/fa";
import Image from "next/image";
import ContactModal from "./ContactModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import ContactProfileButton from "./ContactProfileButtons";
import LoadingSpinner from "./LoadingSpinner";

const FreelancerServicePage = ({ skill }) => {
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (!skill || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
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
        <ContactProfileButton
          listing={skill}
          setIsContactModalOpen={setIsContactModalOpen}
        />
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contacts={contacts}
      />
    </div>
  );
};

export default FreelancerServicePage;
