"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
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
  FiChevronRight,
} from "react-icons/fi";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
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
  const [user] = useAuthState(auth);

  useEffect(() => {
    setLoading(true);
    const fetchUserListings = async (listingType) => {
      try {
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
      } catch (error) {
        console.error(`Error fetching ${listingType}:`, error);
        // Set empty array for failed fetches to prevent UI breaks
        setListings((prev) => ({
          ...prev,
          [listingType]: [],
        }));
      }
    };

    Promise.all([
      fetchUserListings("apartments"),
      fetchUserListings("products"),
      fetchUserListings("services"),
      fetchUserListings("requests"),
    ]).then(() => setLoading(false));
  }, []);

  const categoryIcons = {
    apartments: FiHome,
    products: FiPackage,
    services: FiTool,
    requests: FiHelpCircle,
  };

  const categoryColors = {
    apartments: "from-blue-500 to-blue-600",
    products: "from-emerald-500 to-emerald-600",
    services: "from-amber-500 to-amber-600",
    requests: "from-purple-500 to-purple-600",
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
    const categoryListings = listings[category];

    return (
      <section
        className="mb-8 sm:mb-12 transition-all duration-300"
        aria-label={`${title} listings section`}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            href={`/${category.toLowerCase()}`}
            className="group flex items-center space-x-2"
          >
            <h2 className="text-lg sm:text-2xl font-bold group-hover:text-primary transition-colors">
              {title}
            </h2>
            <FiChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Button
            href={`/${category.toLowerCase()}`}
            className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            aria-label={`View all ${title}`}
          >
            View All
          </Button>
        </div>

        {categoryListings.length > 0 ? (
          <div className="relative">
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
                    className="block transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <ProductCard user={user} listing={listing} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No {category} listings available at the moment.
            </p>
          </div>
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
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            {/* <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 animate-fade-in">
              Find What You Need
            </h1> */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover apartments, products, services, and more in TRNC
            </p>

            {/* Search Section */}
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="flex gap-2 p-2 bg-white rounded-2xl shadow-lg shadow-blue-100"
              >
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listings..."
                  className="flex-1 text-lg p-4 border-0 focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex items-center justify-center p-4">
                  <FiSearch className="w-5 h-5" onSubmit={handleSearch} />
                </div>
              </form>
            </div>
          </div>

          {/* Sticky Header */}
          <div className="sticky top-20 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-md z-20 transition-all duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                Featured Listings
              </h2>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="blue"
                className="px-4 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                aria-label="Create new listing"
              >
                <FiPlus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                <span className="text-white text-sm sm:text-base ml-2">
                  New Listing
                </span>
              </Button>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 sm:p-4 rounded-lg shadow-lg">
            {["apartments", "products", "services", "requests"].map((item) =>
              renderCategoryCard(item, capitalizeFirstLetter(item))
            )}
          </div>

          {/* Listings Sections */}
          <div className="space-y-12">
            {renderSection(
              activeCategory,
              capitalizeFirstLetter(activeCategory)
            )}
            {Object.keys(listings)
              .filter((item) => item !== activeCategory)
              .map((item) =>
                renderSection(
                  item,
                  item.charAt(0).toUpperCase() + item.slice(1)
                )
              )}
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
