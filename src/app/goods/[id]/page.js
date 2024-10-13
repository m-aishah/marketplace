"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import GoodsListingPage from "../../../components/GoodsListing";
import  {getListingFromFirestore } from '../../../utils/firestoreUtils'

// TODO: Do we want the lisitng page to only be accessible to logged in user? or it is if user tries add to cart or whatever that the user should be promptd to login?
const ListingPage = ({ params }) => {
  const { id } = params;

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchGood = async () => {
      try {
        const good = await getListingFromFirestore(id);
        console.log(good);
        setListing(good.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    }

    fetchGood();
  }, [id])
  return (
    // TODO: Pass the listing to the component and display it there
    <ProtectedRoute>
      <GoodsListingPage listing={listing}/>
    </ProtectedRoute>
  );
};

export default ListingPage;
