"use client";
import { useState, useEffect } from "react";
import GoodsListingPage from "../../../components/GoodsListing";
import { getListingFromFirestore } from "../../../utils/firestoreUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

const ListingPage = ({ params }) => {
  const { id } = params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchGood = async () => {
      try {
        const good = await getListingFromFirestore(id);
        console.log(good);
        setListing(good.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    };

    fetchGood();
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return <GoodsListingPage listing={listing} />;
};

export default ListingPage;
