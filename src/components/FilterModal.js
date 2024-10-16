import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function FilterModal({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  dynamicFilters,
  handleApplyFilters,
  handleResetFilters,
}) {
  const handleFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const orderFiltersByName = (filters) => {
    const sortedFilters = Object.keys(filters)
     .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return sortedFilters.reduce((acc, filter) => {
      acc[filter] = filters[filter];
      return acc;
    }, {});
  }

  const orderedFilters = orderFiltersByName(dynamicFilters);

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
                  Filter Options
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block mb-2">Price Range:</label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={tempFilters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="w-full sm:w-1/2"
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={tempFilters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="w-full sm:w-1/2"
                      />
                    </div>
                  </div>
                  {Object.entries(orderedFilters).map(([key, values]) => (
                    <div key={key}>
                      <label className="block mb-2 capitalize">{key}:</label>
                      <select
                        value={tempFilters[key]}
                        onChange={(e) =>
                          handleFilterChange(key, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      >
                        <option value="all">All</option>
                        {values.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <Button
                    onClick={handleResetFilters}
                    className="bg-gray-500 hover:bg-gray-400 text-white"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Apply
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
