"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { FiSearch } from "react-icons/fi";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import homePageData from "./homePageData";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState({
    apartments: 0,
    goods: 0,
    services: 0,
    requests: 0,
  });
  const itemsPerPage = 3;
  const router = useRouter();

  const listings = (() => {
    const temp = {};
    for (const category of Object.keys(homePageData)) {
      temp[category] = homePageData[category].slice(0, 9);
    }
    return temp;
  })();

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

  const renderSection = (category, title) => (
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

      <div className="relative flex items-center justify-between">
        <Button
          onClick={() => handlePrev(category)}
          className="absolute left-0 bg-blue-400 hover:bg-blue-600 text-white p-2 rounded-full opacity-75 w-6"
        >
          <MdArrowBackIos className="h-6 w-6 transform -translate-x-1.5" />
        </Button>

        <div className="grid grid-cols-3 gap-4 mx-auto">
          {paginatedListings(category).map((listing) => (
            <Link href={`/listing/${listing.id}`} key={listing.id}>
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

        <Button
          onClick={() => handleNext(category)}
          className="absolute right-0 bg-blue-400 hover:bg-blue-600 text-white p-2 rounded-full opacity-75 w-6"
        >
          <MdArrowForwardIos className="h-6 w-6 transform -translate-x-2.5" />
        </Button>
      </div>
    </section>
  );

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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl text-center font-semibold mb-4">
            Featured Products
          </h1>
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
    </div>
  );
}
