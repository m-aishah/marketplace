import React from "react";
import Modal from "./Modal";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const FilterModal = ({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  dynamicFilters,
  handleApplyFilters,
  handleResetFilters,
}) => {
  const handleFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const orderFiltersByName = (filters) => {
    const sortedFilters = Object.keys(filters).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    return sortedFilters.reduce((acc, filter) => {
      acc[filter] = filters[filter];
      return acc;
    }, {});
  };

  const orderedFilters = orderFiltersByName(dynamicFilters);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Options">
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Price Range:</label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={tempFilters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-full sm:w-1/2"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={tempFilters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-full sm:w-1/2"
            />
          </div>
        </div>
        {Object.entries(orderedFilters).map(([key, values]) => (
          <div key={key}>
            <label className="block mb-2 capitalize">{key}:</label>
            <select
              value={tempFilters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
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
        <Button onClick={handleResetFilters}>Reset</Button>
        <Button onClick={handleApplyFilters} variant="blue">
          Apply
        </Button>
      </div>
    </Modal>
  );
};

export default FilterModal;
