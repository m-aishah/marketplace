import { useState } from "react";
import { FaHome, FaBox, FaTools, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function CreateListingModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

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
      path: "/create-listing/skills",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl relative">
        {/* Close button (X) */}
        <FaTimes
          className="absolute top-4 right-4 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
          size={20}
          onClick={onClose}
        />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a New Listing
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {options.map((option) => (
            <Link
              key={option.name}
              href={option.path}
              className={`
                flex flex-col items-center p-4 border rounded-lg transition-colors
                bg-gray-100 border-gray-300 text-gray-600
                hover:bg-gray-200 hover:shadow-md
                ${selectedOption === option.name ? "ring-2 ring-gray-400" : ""}
              `}
              onClick={() => setSelectedOption(option.name)}
            >
              <option.icon className={`text-4xl mb-2 ${option.color}`} />
              <span className="text-sm font-medium">{option.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
