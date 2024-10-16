import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const ListingCard = ({ listing, onDelete, onEdit }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
      <p className="text-gray-600 mb-4">{listing.description}</p>
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium px-2 py-1 rounded-full"
          style={{
            backgroundColor:
              listing.listingType === "apartments"
                ? "rgba(59, 130, 246, 0.1)"
                : listing.listingType === "skills"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(245, 158, 11, 0.1)",
            color:
              listing.listingType === "apartments"
                ? "rgb(59, 130, 246)"
                : listing.listingType === "skills"
                ? "rgb(16, 185, 129)"
                : "rgb(245, 158, 11)",
          }}
        >
          {listing.listingType}
        </span>

        {onEdit && ( <div className="flex space-x-2">
          <button
            onClick={() => onEdit(listing.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(listing.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        </div>)}
       
      </div>
    </div>
  </div>
);

export default ListingCard;
