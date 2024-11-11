"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  FiSearch,
  FiPlus,
  FiHome,
  FiPackage,
  FiTool,
  FiHelpCircle,
} from "react-icons/fi";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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
  const [activeCategory, setActiveCategory] = useState("services");
  const itemsPerPage = 4;
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

  const categoryIcons = {
    apartments: FiHome,
    products: FiPackage,
    services: FiTool,
    requests: FiHelpCircle,
  };

  const renderCategoryCard = (category, title) => {
    const Icon = categoryIcons[category];
    return (
      <button
        onClick={() => setActiveCategory(category)}
        className={`
          flex flex-col items-center justify-center
          p-1 sm:p-2 rounded-lg transition-all duration-300
          border-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary
          ${
            activeCategory === category
              ? "text-white border-white brightness-90"
              : "text-white border-transparent hover:border-white hover:brightness-110"
          }
        `}
        aria-pressed={activeCategory === category}
      >
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
        <span className="font-medium text-sm sm:text-base">{title}</span>
      </button>
    );
  };

  const renderSection = (category, title) => {
    const categoryListings = getListings(category);

    return (
      <section className="mb-8 sm:mb-12 transition-opacity duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link href={`/${category.toLowerCase()}`} className="group">
            <h2 className="text-lg sm:text-2xl font-bold group-hover:text-primary transition-colors">
              {title}
            </h2>
          </Link>
          <Button
            href={`/${category.toLowerCase()}`}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-sm sm:text-base">View More</span>
          </Button>
        </div>

        {categoryListings.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={12}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
            }}
            modules={[Pagination]}
            className="w-full"
          >
            {categoryListings.map((listing) => (
              <SwiperSlide key={listing.id}>
                <Link
                  href={`/${category.toLowerCase()}/${listing.id}`}
                  className="transform transition-transform duration-300 hover:scale-102"
                >
                  <ProductCard listing={listing} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center"> No {category} at the moment.</div>
        )}
      </section>
    );
  };

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      <main className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center mb-6 sm:mb-8 space-y-4">
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover apartments, products, services, and more in your
              community
            </p>

            <div className="relative max-w-3xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-3 pr-3 py-2 sm:py-3 text-sm sm:text-base shadow-lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <FiSearch className="text-black h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Search</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-background/80 backdrop-blur-sm p-2 sm:p-4 rounded-lg shadow-sm z-10">
            <h2 className="text-lg sm:text-2xl font-bold">Featured Listings</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="blue"
              className="px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FiPlus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-white text-sm sm:text-base ml-1 sm:ml-2">
                New Listing
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 sm:p-4 rounded-lg shadow-lg">
            {["apartments", "products", "services", "requests"].map((item) =>
              renderCategoryCard(item, capitalizeFirstLetter(item))
            )}
          </div>

          <div className="space-y-8 sm:space-y-12">
            {renderSection(
              activeCategory,
              capitalizeFirstLetter(activeCategory)
            )}
            {["apartments", "products", "services", "requests"]
              .filter((item) => item !== activeCategory)
              .map((item) => renderSection(item, capitalizeFirstLetter(item)))}
          </div>
        </div>
      </main>
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
