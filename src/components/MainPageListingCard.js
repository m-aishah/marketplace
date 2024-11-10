import React from "react";
import { Star, ImageIcon } from "lucide-react";
import { FaTag, FaMapMarkerAlt } from "react-icons/fa";
import { Card, CardContent } from "./Card";
import Image from "next/image";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const getCurrency = (currency) => {
  switch (currency) {
    case "TL":
      return "₺";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "";
  }
};

export const ProductCard = ({ listing }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          {listing.imageUrls && listing.imageUrls.length > 0 ? (
            <Image
              src={listing.imageUrls[0]}
              alt={listing.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full bg-muted bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-2 space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium px-2 py-1 rounded-full transform -translate-x-1 translate-y-1"
              style={{
                backgroundColor:
                  listing.listingType === "apartments"
                    ? "rgba(59, 130, 246, 0.1)"
                    : listing.listingType === "services"
                    ? "rgba(245, 158, 11, 0.1)"
                    : listing.listingType === "products"
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(185, 78, 16, 0.1)",
                color:
                  listing.listingType === "apartments"
                    ? "rgb(59, 130, 246)"
                    : listing.listingType === "services"
                    ? "rgb(245, 158, 11)"
                    : listing.listingType === "products"
                    ? "rgb(16, 185, 129)"
                    : "rgb(235, 72, 72)",
              }}
            >
              {listing.category}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {listing.name}
          </h3>
          <p className="text-sm line-clamp-2 h-10 text-muted-foreground">
            {listing.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-green-600">
              <FaTag className="text-base" />
              <span className="text-base font-semibold">
                {listing?.price
                  ? `${listing.price} ${getCurrency(listing.currency)}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <FaMapMarkerAlt className="text-base" />
              <span className="text-sm">{listing?.location || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};