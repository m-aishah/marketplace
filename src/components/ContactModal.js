import React from "react";
import Modal from "./Modal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const contactIcons = {
  whatsapp: FaWhatsapp,
  call: FaPhoneAlt,
  email: FaEnvelope,
  instagram: FaInstagram,
};

const contactLabels = {
  whatsapp: "Chat on WhatsApp",
  call: "Make a call",
  email: "Send an email",
  instagram: "Visit Instagram profile",
};

const ContactModal = ({ isOpen, onClose, contacts, listingOwnerId }) => {
  const [user] = useAuthState(auth);

  const handleContactClick = (contact) => {
    if (user && user.uid === listingOwnerId) {
      toast.error("You cannot contact yourself.");
    } else {
      window.open(getContactLink(contact), "_blank", "noopener noreferrer");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Options">
      <div className="mt-4 space-y-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            const Icon = contactIcons[contact.type] || FaEnvelope;
            return (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group cursor-pointer"
              >
                <div className="flex items-center">
                  <Icon className="mr-3 text-blue-600 text-xl" />
                  <div className="flex flex-col">
                    <span className="text-blue-700 font-medium">
                      {contactLabels[contact.type]}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {contact.value}
                    </span>
                  </div>
                </div>
                <FaExternalLinkAlt className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-800 py-4">
            User Has No Contact Info
          </div>
        )}
      </div>
    </Modal>
  );
};

const getContactLink = (contact) => {
  switch (contact.type) {
    case "whatsapp":
      return `https://wa.me/${contact.value}`;
    case "call":
      return `tel:${contact.value}`;
    case "email":
      return `mailto:${contact.value}`;
    case "instagram":
      return `https://instagram.com/${contact.value}`;
    default:
      return "#";
  }
};

export default ContactModal;
