"use client";
import { useState, useEffect } from "react";
import ApartmentListingPage from "../../../components/ApartmentListing";
import { getListingFromFirestore } from "../../../utils/firestoreUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

const ListingPage = ({ params }) => {
  const { id } = params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchApartment = async () => {
      try {
        const apartment = await getListingFromFirestore(id);
        console.log(apartment);
        setListing(apartment.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    };

    fetchApartment();
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return <ApartmentListingPage apartment={listing} />;
};

export default ListingPage;
