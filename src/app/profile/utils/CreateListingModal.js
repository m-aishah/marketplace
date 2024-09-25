import { useState } from 'react';
import { FaHome, FaBox, FaTools } from 'react-icons/fa';
import Link from 'next/link';

export default function CreateListingModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const options = [
    { name: 'Apartment', icon: FaHome, path: '/create-listing/apartments' },
    { name: 'Goods', icon: FaBox, path: '/create-listing/goods' },
    { name: 'Service', icon: FaTools, path: '/create-listing/skills' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create a New Listing</h2>
        <div className="grid grid-cols-3 gap-4">
          {options.map((option) => (
            <Link 
              key={option.name}
              href={option.path}
              className={`flex flex-col items-center p-4 border rounded-lg transition-colors
                ${selectedOption === option.name 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'hover:bg-gray-100'
                }`}
              onClick={() => setSelectedOption(option.name)}
            >
              <option.icon className="text-4xl mb-2" />
              <span className="text-sm font-medium">{option.name}</span>
            </Link>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}