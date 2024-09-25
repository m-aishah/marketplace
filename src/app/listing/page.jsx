"use client";
import react, {useEffect, useState} from "react"
import ApartmentListingPage from "./listingCategory/apartmentListing";
import GoodsListingPage from "./listingCategory/goodsListing";
import FreelancerServicePage from "./listingCategory/serviceListing";


const listingPage = () => {
    return (
            <ApartmentListingPage />
            // <GoodsListingPage />
            // <FreelancerServicePage />
    )   
};

export default listingPage;