"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState({
    apartments: [],
    goods: [],
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
      fetchUserListings("goods"),
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
          <Link href={`/${category.toLowerCase()}`}>
            <Button className="transition font-medium text-sm rounded-full text-center bg-brand text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80 px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center">
              View More
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryListings.map((listing) => (
            <Link
              href={`/${category.toLowerCase()}/${listing.id}`}
              key={listing.id}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="p-4">
                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={listing.imageUrls[0]}
                          alt={listing.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-muted bg-gray-200 flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {listing.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {listing.category}
                    </p>
                    <p className="font-bold text-lg mb-2">${listing.price}</p>
                    <p className="text-sm line-clamp-2 h-10 text-muted-foreground">
                      {listing.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find What You Need</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover apartments, goods, services, and more in your community
            </p>
          </div>

          <div className="relative flex items-center w-full space-x-3">
            <div className="relative w-full">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 cursor-pointer"
                onClick={handleSearch}
              />
              <Input
                type="text"
                placeholder="Search for apartments, goods, services, or requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-2 text-xl"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="transition font-medium text-sm rounded-full text-center bg-brand text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80 px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center"
            >
              Search
            </Button>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="transition font-medium text-sm rounded-full text-center bg-transparent text-black ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center"
            >
              <FiPlus className="mr-2 lg:h-5 lg:w-5 text-black" />
              <span className="text-black">New Listing</span>
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {renderSection("apartments", "Apartments")}
              {renderSection("goods", "Goods")}
              {renderSection("services", "Services")}
              {renderSection("requests", "Requests")}
            </>
          )}
        </div>
      </main>
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
