"use client";

import { useState, useEffect, Suspense } from "react";
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
import LoadingSpinner from "@/components/LoadingSpinner";

function RequestsPageContent() {
  const [listings, setListings] = useState({
    apartments: [],
    goods: [],
    services: [],
    requests: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
    setLoading(false);
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
        No listings found for the query &quot;{searchQuery}&quot;.
      </p>
    );

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <ListingPage
          listingsArray={filteredListings}
          category="search-results"
          title={'Search Results for "' + searchQuery + '"'}
        />
      )}
    </>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RequestsPageContent />
    </Suspense>
  );
}
