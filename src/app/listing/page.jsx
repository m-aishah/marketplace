"use client";
import react, {useEffect, useState} from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ApartmentListingPage from "./listingCategory/apartmentListing";
import GoodsListingPage from "./listingCategory/goodsListing";
import FreelancerServicePage from "./listingCategory/serviceListing";


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