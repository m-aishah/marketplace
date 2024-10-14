"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FiSearch, FiPlus } from "react-icons/fi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import CreateListingModal from "../app/profile/utils/CreateListingModal";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState({
    apartments: 0,
    goods: 0,
    services: 0,
    requests: 0,
  });
  const [listings, setListings] = useState({
    apartments: [],
    goods: [],
    services: [],
    requests: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const fetchUserListings = async (listingType) => {
      const listingsQuery = query(
        collection(db, "listings"),
        where("listingType", "==", listingType),
        orderBy("createdAt", "desc"),
        limit(9)
      );
      const listingsSnapshot = await getDocs(listingsQuery);
      const fetchedListings = listingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings((prev) => ({
        ...prev,
        [listingType]: fetchedListings,
      }));
    };

    fetchUserListings("apartments");
    fetchUserListings("goods");
    fetchUserListings("services");
    fetchUserListings("requests");
  }, []);

  const handleNext = (category) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]:
        (prev[category] + 1) %
        Math.ceil(listings[category].length / itemsPerPage),
    }));
  };

  const handlePrev = (category) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]:
        (prev[category] -
          1 +
          Math.ceil(listings[category].length / itemsPerPage)) %
        Math.ceil(listings[category].length / itemsPerPage),
    }));
  };

  const paginatedListings = (category) => {
    const start = currentPage[category] * itemsPerPage;
    const end = start + itemsPerPage;
    return listings[category].slice(start, end);
  };

  const renderSection = (category, title) => {
    const paginated = paginatedListings(category);

    if (paginated.length === 0) return null;

    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/${category.toLowerCase()}`}>
            <h2 className="text-2xl font-semibold">{title}</h2>
          </Link>
          <Link href={`/${category.toLowerCase()}`}>
            <Button className="bg-blue-400 hover:bg-blue-600 text-white p-2 rounded-full">
              View More
            </Button>
          </Link>
        </div>

        <div className="relative flex items-center justify-center">
          <Button
            onClick={() => handlePrev(category)}
            className="absolute left-0 bg-blue-400 hover:bg-blue-600 text-white p-2 rounded-full opacity-75 w-6"
          >
            <MdArrowBackIos className="h-6 w-6 transform -translate-x-1.5" />
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto justify-center">
            {paginated.map((listing) => (
              <Link
                href={`/${category.toLowerCase()}/${listing.id}`}
                key={listing.id}
              >
                <Card className="w-full sm:w-full md:w-full">
                  <CardContent className="p-4">
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
                    <p className="font-medium mt-2">${listing.price}</p>
                    <p className="text-sm mt-2 line-clamp-2">
                      {listing.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Button
            onClick={() => handleNext(category)}
            className="absolute right-0 bg-blue-400 hover:bg-blue-600 text-white p-2 rounded-full opacity-75 w-6"
          >
            <MdArrowForwardIos className="h-6 w-6 transform -translate-x-2.5" />
          </Button>
        </div>
      </section>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleCreateListing = () => {
    router.push("/create-listing");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Featured Products</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center"
            >
              <FiPlus className="mr-2" /> Create Listing
            </Button>
          </div>
          <div className="relative">
            <div onClick={handleSearch}>
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 cursor-pointer" />
            </div>
            <Input
              type="text"
              placeholder="Search for apartments, goods, services, or requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-4 pr-4 py-2 text-xl"
            />
          </div>
          {renderSection("apartments", "Apartments")}
          {renderSection("goods", "Goods")}
          {renderSection("services", "Services")}
          {renderSection("requests", "Requests")}
        </div>
      </main>
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateListing={handleCreateListing}
      />
    </div>
  );
}
