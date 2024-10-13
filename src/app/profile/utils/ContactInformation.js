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
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const contactTypes = [
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { value: "call", label: "Phone Call", icon: FaPhone },
  { value: "email", label: "Email", icon: FaEnvelope },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
];

export default function ContactInformation({ userId }) {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContactType, setNewContactType] = useState("whatsapp");
  const [newContactValue, setNewContactValue] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
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

  const validateContact = () => {
    switch (newContactType) {
      case "whatsapp":
      case "call":
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(countryCode + newContactValue)) {
          setError("Invalid phone number");
          return false;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newContactValue)) {
          setError("Invalid email address");
          return false;
        }
        break;
      case "instagram":
        const instagramRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
        if (!instagramRegex.test(newContactValue)) {
          setError("Invalid Instagram username");
          return false;
        }
        break;
    }
    setError("");
    return true;
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!validateContact()) return;

    const value =
      newContactType === "whatsapp" || newContactType === "call"
        ? countryCode + newContactValue
        : newContactValue;

    const newContact = {
      userId: userId,
      type: newContactType,
      value: value,
    };

    try {
      const docRef = await addDoc(collection(db, "contacts"), newContact);
      setContacts([...contacts, { id: docRef.id, ...newContact }]);
      setNewContactValue("");
      setCountryCode("+1");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding contact: ", error);
      setError("Failed to add contact. Please try again.");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (contacts.length > 1) {
      try {
        await deleteDoc(doc(db, "contacts", contactId));
        setContacts(contacts.filter((contact) => contact.id !== contactId));
      } catch (error) {
        console.error("Error deleting contact: ", error);
        setError("Failed to delete contact. Please try again.");
      }
    } else {
      setError("You must have at least one contact method.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contact Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your contact details.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          aria-label="Add New Contact"
        >
          <FaPlus className="w-5 h-5" />
        </button>
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
                {contacts.length > 1 && (
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
            You don't have any contact information yet.
          </p>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New Contact
                  </Dialog.Title>
                  <form onSubmit={handleAddContact} className="mt-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Type
                      </label>
                      <select
                        value={newContactType}
                        onChange={(e) => setNewContactType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        {contactTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(newContactType === "whatsapp" ||
                      newContactType === "call") && (
                      <div className="mb-4 flex">
                        <input
                          type="text"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          placeholder="Country Code"
                          className="mt-1 block w-1/4 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <input
                          type="text"
                          value={newContactValue}
                          onChange={(e) => setNewContactValue(e.target.value)}
                          placeholder="Phone Number"
                          className="mt-1 block w-3/4 rounded-r-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    )}
                    {(newContactType === "email" ||
                      newContactType === "instagram") && (
                      <div className="mb-4">
                        <input
                          type="text"
                          value={newContactValue}
                          onChange={(e) => setNewContactValue(e.target.value)}
                          placeholder={
                            newContactType === "email"
                              ? "Email Address"
                              : "Instagram Username"
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    )}
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Add Contact
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
