"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { FiSearch } from "react-icons/fi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { RiFilter2Fill } from "react-icons/ri";
import FilterModal from "@/components/FilterModal";
import CreateListingModal from "../app/profile/utils/CreateListingModal";
import { fetchPaginatedListingsByListingType } from "@/utils/firestoreUtils";
import LoadingSpinner from "./LoadingSpinner";
import ListingPageHeader from "./ListingPageHeader";
import { ProductCard } from "@/components/MainPageListingCard";

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

export default function ListingPage({ listingsArray, category, title }) {
  const [listings, setListings] = useState(listingsArray || []);
  const [loading, setLoading] = useState(listingsArray ? false : true);
  const [lastVisibleListing, setLastVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!listingsArray) {
      const fetchListings = async () => {
        setLoading(true);
        const result = await fetchPaginatedListingsByListingType(
          category,
          itemsPerPage,
          lastVisibleListing
        );
        setListings(result.listings);
        setLastVisible(result.lastVisible);
        setLoading(false);
      };

      fetchListings();
    }
  }, [category, itemsPerPage]);

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
      setLastVisible(listings[currentPage * itemsPerPage + itemsPerPage - 1]);
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

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
    setTempFilters(filters);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setTempFilters(initialFilters);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, filteredListings]);

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

  const getCurrency = (currency) => {
    switch (currency) {
      case "TL":
        return "₺";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ListingPageHeader
            title={title}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />

          <div className="flex items-center justify-between mb-4 space-x-2">
            {category !== "search-results" && (
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder={`Search for ${category}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            )}
            <Button onClick={toggleFilterModal} variant="blue">
              <RiFilter2Fill className="lg:h-6 lg:w-6 mr-2" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <LoadingSpinner />
            ) : (
              paginatedListings.map((listing) => (
                <Link
                  href={`/${category.toLowerCase()}/${listing.id}`}
                  key={listing.id}
                  className="group"
                >
                  <ProductCard listing={listing} />
                </Link>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between my-4 space-y-4 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
              <Button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                variant="blue"
              >
                <MdArrowBackIos />
                <span>Previous</span>
              </Button>
              <span className="mx-4">
                {totalPages
                  ? "Page " + (currentPage + 1) + " of " + totalPages
                  : "Page 0 of 0"}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className={`${
                  currentPage >= totalPages - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                variant="blue"
              >
                <span>Next</span>
                <MdArrowForwardIos />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage">Items per page:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setLastVisible(null);
                  setItemsPerPage(Number(e.target.value));
                }}
                className="border p-1"
              >
                {generateOptions(5, 20)}
              </select>
            </div>
          </div>
        </div>
      </main>

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={toggleFilterModal}
          filters={filters}
          tempFilters={tempFilters}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
          dynamicFilters={dynamicFilters}
          setTempFilters={setTempFilters}
        />
      )}

      {isCreateModalOpen && (
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
