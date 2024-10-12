"use client";

import { useState, useEffect } from "react";
import ListingPage from "../../components/ListingPage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default function RequestsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsQuery = query(
        collection(db, "listings"),
        where("listingType", "==", "apartments")
      );
      const listingsSnapshot = await getDocs(listingsQuery);
      const fetchedListings = listingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(fetchedListings);
    };

    fetchUserListings();
  }, []);

  return (
    <ListingPage listings={listings} category="apartments" title="Apartments" />
  );
}
