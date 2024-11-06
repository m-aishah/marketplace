import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  FaPlus,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";
import AddContactModal from "./AddContactModal";

const contactTypes = [
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { value: "call", label: "Phone Call", icon: FaPhone },
  { value: "email", label: "Email", icon: FaEnvelope },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
];

export default function ContactInformation({ userId, isOwnProfile }) {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsQuery = query(
        collection(db, "contacts"),
        where("userId", "==", userId)
      );
      const contactsSnapshot = await getDocs(contactsQuery);
      setContacts(
        contactsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchContacts();
  }, [userId]);

  const handleAddContact = async (newContact) => {
    const contactToAdd = {
      userId: userId,
      ...newContact,
    };

    try {
      const docRef = await addDoc(collection(db, "contacts"), contactToAdd);
      setContacts([...contacts, { id: docRef.id, ...contactToAdd }]);
      setError("");
    } catch (error) {
      console.error("Error adding contact: ", error);
      setError("Failed to add contact. Please try again.");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!isOwnProfile) return;
    if (contacts.length > 1) {
      try {
        await deleteDoc(doc(db, "contacts", contactId));
        setContacts(contacts.filter((contact) => contact.id !== contactId));
        setError("");
      } catch (error) {
        console.error("Error deleting contact: ", error);
        setError("Failed to delete contact. Please try again.");
      }
    } else {
      setError("You must have at least one contact method.");
    }
  };

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contact Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isOwnProfile ? "Manage your contact details." : "Contact details."}
          </p>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            aria-label="Add New Contact"
          >
            <FaPlus className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 gap-4 p-4">
          {contacts.map((contact) => {
            const Icon =
              contactTypes.find((type) => type.value === contact.type)?.icon ||
              FaEnvelope;
            return (
              <div
                key={contact.id}
                className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-700 capitalize">
                      {contact.type}
                    </p>
                    <p className="text-gray-600">{contact.value}</p>
                  </div>
                </div>
                {isOwnProfile && contacts.length > 1 && (
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {contacts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {isOwnProfile
              ? "You don't have any contact information yet."
              : "No contact information available."}
          </p>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>

      {isOwnProfile && (
        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddContact={handleAddContact}
        />
      )}
    </div>
  );
}
