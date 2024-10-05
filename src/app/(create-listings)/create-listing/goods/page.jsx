"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ListingForm from "@/components/ListingForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import categories from "./categories";

function CreateListing() {
  const [user] = useAuthState(auth);

  return (
    <ProtectedRoute>
      <div className="w-full h-full flex justify-center items-center pb-28">
        <div className="w-full h-full p-4 flex flex-col items-center md:w-[700px] md:p-10">
          <div className="mb-10 self-start">
            <h1 className="text-black text-xl md:text-3xl font-semibold tracking-tight mb-2">
              Add Product
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-light tracking-normal">
              Add details about your product and click the submit button to
              upload.
            </p>
          </div>
            <ListingForm user={user} categories={categories} listingType="goods" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CreateListing;
