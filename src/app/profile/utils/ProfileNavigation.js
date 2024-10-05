import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileNavigation({ onCreateListing }) {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg">
      <Link
        href="/"
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>
      <button
        onClick={onCreateListing}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create New Listing
      </button>
    </nav>
  );
}
