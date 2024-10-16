"use client";
import { useState, useEffect } from "react";
import FreelancerServicePage from "../../../components/ServiceListing";
import { getListingFromFirestore } from "../../../utils/firestoreUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

const ListingPage = ({ params }) => {
  const { id } = params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchSkill = async () => {
      try {
        const skill = await getListingFromFirestore(id);
        setListing(skill.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    };

    fetchSkill();
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return <FreelancerServicePage skill={listing} />;
};

export default ListingPage;
