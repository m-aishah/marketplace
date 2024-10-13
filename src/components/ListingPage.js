import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FiSearch } from "react-icons/fi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { RiFilter2Fill } from "react-icons/ri";
import { Modal } from "@/components/Modal";

const isPriceInRange = (price, minPrice, maxPrice) => {
  if (minPrice === "" && maxPrice === "") return true;
  if (minPrice === "") return price <= Number(maxPrice);
  if (maxPrice === "") return price >= Number(minPrice);
  return price >= Number(minPrice) && price <= Number(maxPrice);
};

const excludedFields = [
  "id",
  "listingType",
  "createdAt",
  "price",
  "userId",
  "description",
];

export default function ListingPage({ listings, category, title }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dynamicFilters = useMemo(() => {
    const filterOptions = {};
    listings.forEach((listing) => {
      Object.entries(listing).forEach(([key, value]) => {
        if (
          !excludedFields.includes(key) &&
          (typeof value === "string" || typeof value === "number")
        ) {
          if (!filterOptions[key]) filterOptions[key] = new Set();
          filterOptions[key].add(value);
        }
      });
    });
    return Object.fromEntries(
      Object.entries(filterOptions).map(([key, values]) => [
        key,
        Array.from(values),
      ])
    );
  }, [listings]);

  const initialFilters = {
    ...Object.fromEntries(
      Object.keys(dynamicFilters).map((key) => [key, "all"])
    ),
    minPrice: "",
    maxPrice: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch = listing.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (key === "minPrice" || key === "maxPrice") {
          return isPriceInRange(
            listing.price,
            filters.minPrice,
            filters.maxPrice
          );
        }
        return value === "all" || listing[key] === value;
      });
      return matchesSearch && matchesFilters;
    });
  }, [listings, searchQuery, filters]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginatedListings = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredListings.slice(start, end);
  }, [currentPage, itemsPerPage, filteredListings]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setTempFilters(filters);
  };

  const handleFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsModalOpen(false);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setTempFilters(initialFilters);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredListings]);

  const generateOptions = (n, upperLimit) => {
    const options = [];
    for (let i = n; i <= upperLimit; i += n) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0">
            {category !== "search-results" && (
              <div className="relative flex-grow w-full sm:w-auto sm:mr-4">
                <Input
                  type="text"
                  placeholder={`Search for ${category}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 text-xl"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            )}
            <div className="flex items-center w-full sm:w-auto">
              <Button
                onClick={toggleModal}
                className="flex items-center w-full sm:w-auto justify-center"
              >
                <RiFilter2Fill className="h-6 w-6" />
                <span className="ml-1">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedListings.map((listing) => (
              <Link
                href={`/${category.toLowerCase()}/${listing.id}`}
                key={listing.id}
              >
                <Card className="h-full">
                  <CardContent className="p-4 flex flex-col h-full">
                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                      <Image
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        width={400}
                        height={300}
                        className="w-full h-40 object-cover mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                        <span>No Image Available</span>
                      </div>
                    )}
                    <h3 className="font-semibold">{listing.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {listing.category}
                    </p>
                    <p className="font-medium mt-2 mt-auto">${listing.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between my-4 space-y-4 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
              <Button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`flex items-center bg-blue-400 ${
                  currentPage === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                } text-white p-2 rounded-full mr-2`}
              >
                <MdArrowBackIos className="h-6 w-6 mr-1" />
                <p>Previous</p>
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center bg-blue-400 ${
                  currentPage >= totalPages - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                } text-white p-2 rounded-full ml-2`}
              >
                <p>Next</p>
                <MdArrowForwardIos className="h-6 w-6 ml-1" />
              </Button>
            </div>

            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end">
              <span className="mr-2 text-black">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="border border-gray-300 rounded-lg p-2"
              >
                {generateOptions(5, 30)}
              </select>
            </div>
          </div>

          {isModalOpen && (
            <Modal onClose={toggleModal}>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
                <div className="space-y-4">
                  {Object.entries(dynamicFilters).map(([key, values]) => (
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
                </div>
                <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    onClick={handleResetFilters}
                    className="bg-gray-500 hover:bg-gray-400 text-black p-2 rounded w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-blue-400 hover:bg-blue-600 text-white p-2 rounded w-full sm:w-auto"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={toggleModal}
                    className="bg-red-400 hover:bg-red-600 text-white p-2 rounded w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}
