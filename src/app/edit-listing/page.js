"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import ListingForm from "@/components/ListingForm";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import BackButton from "@/components/BackButton";

function EditListingContent() {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (listingId) {
        const listingDoc = await getDoc(doc(db, "listings", listingId));
        if (listingDoc.exists()) {
          setListingData({ ...listingDoc.data(), id: listingId });
        } else {
          console.error("Listing not found");
        }
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listingData) {
    return <p>Listing not found</p>;
  }

  return (
    <ProtectedRoute>
      <div className="w-full h-full flex justify-center items-center pb-28">
        <div className="w-full h-full p-4 flex flex-col items-center md:w-[700px] md:p-10">
          {/* Back Link */}
          <BackButton />
          {/* Heading */}
          <div className="mb-10 self-start">
            <h1 className="text-black text-xl md:text-3xl font-semibold tracking-tight mb-2">
              Edit Listing
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-light tracking-normal">
              Make changes to your listing and click the Update button to save.
            </p>
          </div>

          {/* Listing Form */}
          <ListingForm
            user={user}
            categories={["apartments", "skills", "products"]}
            listingType={listingData.listingType}
            listingData={listingData}
            listingId={listingId}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function EditListing() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditListingContent />
    </Suspense>
  );
}
