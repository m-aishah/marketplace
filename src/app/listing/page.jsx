"use client";
import react, {useEffect, useState} from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ApartmentListingPage from "./listingCategory/apartmentListing";
import GoodsListingPage from "./listingCategory/goodsListing";
import FreelancerServicePage from "./listingCategory/serviceListing";

// TODO: Do we want the lisitng page to only be accessible to logged in user? or it is if user tries add to cart or whatever that the user should be promptd to login?
const listingPage = () => {
    return (
        <ProtectedRoute>
            <ApartmentListingPage />
            // <GoodsListingPage />
            // <FreelancerServicePage />
        </ProtectedRoute>
    )   
};

export default listingPage;