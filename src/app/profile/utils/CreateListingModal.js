import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaHome, FaBox, FaTools, FaTimes } from "react-icons/fa";
import Link from "next/link";

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
];

export default function CreateListingModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Create a New Listing
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {options.map((option) => (
                    <Link
                      key={option.name}
                      href={option.path}
                      className={`flex items-center p-4 rounded-lg ${
                        selectedOption === option.name
                          ? "bg-gray-100"
                          : "bg-white"
                      } hover:bg-gray-50 transition-colors`}
                      onClick={() => setSelectedOption(option.name)}
                    >
                      <option.icon className={`w-6 h-6 mr-3 ${option.color}`} />
                      <span className="text-gray-700 font-medium">
                        {option.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
