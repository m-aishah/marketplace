"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { FiSearch, FiPlus } from "react-icons/fi";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import CreateListingModal from "../app/profile/utils/CreateListingModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ProductCard } from "@/components/MainPageListingCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState({
    apartments: [],
    products: [],
    services: [],
    requests: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUserListings = async (listingType) => {
      const listingsQuery = query(
        collection(db, "listings"),
        where("listingType", "==", listingType),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
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

    Promise.all([
      fetchUserListings("apartments"),
      fetchUserListings("products"),
      fetchUserListings("services"),
      fetchUserListings("requests"),
    ]).then(() => setLoading(false));
  }, []);

  const getListings = (category) => {
    return listings[category].slice(0, itemsPerPage);
  };

  const renderSection = (category, title) => {
    const categoryListings = getListings(category);

    if (categoryListings.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${category.toLowerCase()}`} className="group">
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
              {title}
            </h2>
          </Link>
          <Button href={`/${category.toLowerCase()}`}>View More</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryListings.map((listing) => (
            <Link
              href={`/${category.toLowerCase()}/${listing.id}`}
              key={listing.id}
              className="group"
            >
              <ProductCard listing={listing} />
            </Link>
          ))}
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find What You Need</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover apartments, products, services, and more in your
              community
            </p>
          </div>
          <div className="relative flex items-center w-full space-x-3">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for apartments, products, services, or requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-4 pr-4 py-2"
              />
            </div>
            <Button onClick={handleSearch}>
              <FiSearch className="text-black mr-2 h-4 w-4 cursor-pointer" />
              Search
            </Button>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Featured Listings
            </h2>
            <Button onClick={() => setIsModalOpen(true)} variant="blue">
              <FiPlus className="mr-2 lg:h-5 lg:w-5 text-white" />
              <span className="text-white">New Listing</span>
            </Button>
          </div>
          {renderSection("apartments", "Apartments")}
          {renderSection("products", "Products")}
          {renderSection("services", "Services")}
          {renderSection("requests", "Requests")}
        </div>
      </main>
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
