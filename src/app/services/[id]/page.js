"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import FreelancerServicePage from "../../../components/ServiceListing";
import  {getListingFromFirestore } from '../../../utils/firestoreUtils'

// TODO: Do we want the lisitng page to only be accessible to logged in user? or it is if user tries add to cart or whatever that the user should be promptd to login?
const ListingPage = ({ params }) => {
  const { id } = params;

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const skill = await getListingFromFirestore(id);
        console.log(skill);
        setListing(skill.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    }

    fetchSkill();
  }, [id])

  return (
    // TODO: Handle loading and erros
    <ProtectedRoute>
      <FreelancerServicePage skill={listing}/>
    </ProtectedRoute>
  );
};

export default ListingPage;
