import React, { useState } from "react";
import Modal from "@/components/Modal";
import Link from "next/link";
import { FaHome, FaBox, FaTools, FaRegQuestionCircle } from "react-icons/fa";

const options = [
  {
    name: "Apartment",
    icon: FaHome,
    path: "/create-listing/apartments",
    color: "text-blue-500",
  },
  {
    name: "Goods",
    icon: FaBox,
    path: "/create-listing/goods",
    color: "text-green-500",
  },
  {
    name: "Service",
    icon: FaTools,
    path: "/create-listing/services",
    color: "text-yellow-500",
  },
  {
    name: "Request",
    icon: FaRegQuestionCircle,
    path: "/create-listing/requests",
    color: "text-orange-500",
  },
];

export default function CreateListingModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Listing">
      <div className="mt-4 grid grid-cols-1 gap-4">
        {options.map((option) => (
          <Link
            key={option.name}
            href={option.path}
            className={`flex items-center p-4 rounded-lg ${
              selectedOption === option.name ? "bg-gray-100" : "bg-white"
            } hover:bg-gray-50 transition-colors`}
            onClick={() => setSelectedOption(option.name)}
          >
            <option.icon className={`w-6 h-6 mr-3 ${option.color}`} />
            <span className="text-gray-700 font-medium">{option.name}</span>
          </Link>
        ))}
      </div>
    </Modal>
  );
}
