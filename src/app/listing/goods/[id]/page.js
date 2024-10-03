"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import GoodsListingPage from "../goodsListing";
import { db } from "@/firebase";

// TODO: Do we want the lisitng page to only be accessible to logged in user? or it is if user tries add to cart or whatever that the user should be promptd to login?
const ListingPage = ({ params }) => {
  const { id } = params;

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchUserListing = async () => {
      try {
        const listingRef = doc(db, "listings", id);
        const listingSnapshot = await getDoc(listingRef);

        if (listingSnapshot.exists()) {
          setListing({ id: listingSnapshot.id, ...listingSnapshot.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user listing: ", error);
      }
    };

    fetchUserListing();
  }, [id]);

  if (!listing) return <p className="text-center">Apartment Not Found</p>;

  return (
    // TODO: Pass the listing to the component and display it there
    <ProtectedRoute>
      <GoodsListingPage />
    </ProtectedRoute>
  );
};

export default ListingPage;
