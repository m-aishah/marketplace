"use client";

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

export default function ListingPage({ listings, category, title, filters }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        return listing.title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter((listing) => {
        return selectedFilter
          ? listing.type.toLowerCase() === selectedFilter.toLowerCase()
          : true;
      });
  }, [listings, searchQuery, selectedFilter]);

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
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredListings]);

  const generateOptions = (upperLimit) => {
    const options = [];
    for (let i = 6; i <= upperLimit; i += 3) {
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

          <div className="flex items-center justify-between mb-4">
            {category != "search-results" ? (
              <div className="relative flex-grow mr-4">
                <Input
                  type="text"
                  placeholder={`Search for ${category}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 text-xl"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            ) : (
              []
            )}
            <div className="flex items-center">
              <Button onClick={toggleModal} className="flex items-center ml-2">
                <RiFilter2Fill className="h-6 w-6" />
                <span className="ml-1">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {paginatedListings.map((listing) => (
              <Link
                href={`/${category.toLowerCase()}/${listing.id}`}
                key={listing.id}
              >
                <Card>
                  <CardContent className="p-4">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      width={400}
                      height={300}
                      className="w-full h-40 object-cover mb-2"
                    />
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {listing.type}
                    </p>
                    <p className="font-medium mt-2">{listing.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between my-4">
            <div className="flex items-center">
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

            <div className="flex items-center">
              <span className="mr-2 text-black">Items per page :</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="border border-gray-300 rounded-lg p-2"
              >
                {generateOptions(30)}
              </select>
            </div>
          </div>

          {isModalOpen && (
            <Modal onClose={toggleModal}>
              <div className="p-4">
                <h2 className="text-xl font-semibold">Filter Options</h2>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mt-4"
                >
                  <option value="">All</option>
                  {filters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={toggleModal}
                    className="bg-blue-400 hover:bg-blue-600 text-white p-2 rounded"
                  >
                    Close
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
