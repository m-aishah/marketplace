import React, { useState } from "react";
import Modal from "@/components/Modal";
import { FaWhatsapp, FaPhone, FaEnvelope, FaInstagram } from "react-icons/fa";

const contactTypes = [
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { value: "call", label: "Phone Call", icon: FaPhone },
  { value: "email", label: "Email", icon: FaEnvelope },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
];

export default function AddContactModal({ isOpen, onClose, onAddContact }) {
  const [newContactType, setNewContactType] = useState("whatsapp");
  const [newContactValue, setNewContactValue] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateContact()) return;

    const value =
      newContactType === "whatsapp" || newContactType === "call"
        ? countryCode + newContactValue
        : newContactValue;

    onAddContact({ type: newContactType, value });
    setNewContactValue("");
    setCountryCode("+1");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Contact">
      <form onSubmit={handleSubmit} className="mt-4">
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
        {(newContactType === "whatsapp" || newContactType === "call") && (
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
        {(newContactType === "email" || newContactType === "instagram") && (
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add Contact
          </button>
        </div>
      </form>
    </Modal>
  );
}
