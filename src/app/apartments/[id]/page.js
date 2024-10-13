"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ApartmentListingPage from "../../../components/ApartmentListing";
import  {getListingFromFirestore } from '../../../utils/firestoreUtils'

// TODO: Do we want the lisitng page to only be accessible to logged in user? or it is if user tries add to cart or whatever that the user should be promptd to login?
const ListingPage = ({ params }) => {
  const { id } = params;

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const apartment = await getListingFromFirestore(id);
        console.log(apartment);
        setListing(apartment.listing);
      } catch (error) {
        console.error("Error fetching good: ", error);
      }
    }

    fetchApartment();
  }, [id])
  // if (!listing) return <p className="text-center">Apartment Not Found</p>;

  return (
    // TODO: Pass the listing to the component and display it there
    <ProtectedRoute>
      <ApartmentListingPage apartment={listing}/>
    </ProtectedRoute>
  );
};

export default ListingPage;
