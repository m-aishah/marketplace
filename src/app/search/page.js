"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ListingPage from "../../components/ListingPage";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function RequestsPage() {
  const [listings, setListings] = useState({
    apartments: [],
    goods: [],
    services: [],
    requests: [],
  });

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

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const filteredListings = Object.keys(listings).reduce((acc, category) => {
    const categoryListings = listings[category].filter((listing) =>
      listing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc.concat(categoryListings);
  }, []);

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
      title={'Search Results for "' + searchQuery + '"'}
    />
  );
}
