"use client";

import { useSearchParams } from "next/navigation";
import homePageData from "../homePageData";
import ListingPage from "../../components/ListingPage";

export default function RequestsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const filteredListings = Object.keys(homePageData).reduce((acc, category) => {
    const categoryListings = homePageData[category].filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc.concat(categoryListings);
  }, []);

  const filters = [];

  for (const category of Object.keys(homePageData)) {
    const uniqueTypes = new Set(
      homePageData[category].map((listing) => listing.type)
    );
    const filteredTypes = [...uniqueTypes].filter((type) =>
      filteredListings.some((listing) => listing.type === type)
    );
    filters.push(...filteredTypes);
  }

  if (!filteredListings.length)
    return (
      <p className="text-center m-20">
        No listings found for the query "{searchQuery}".
      </p>
    );

  return (
    <ListingPage
      listings={filteredListings}
      category="search-results"
      title="Search Results"
      filters={filters}
    />
  );
}
