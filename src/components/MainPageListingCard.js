import React from "react";
import { Share2, Heart, ImageIcon, Tag, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const getCategoryStyles = (listingType) => {
  const styles = {
    apartments: { bg: "bg-blue-100", text: "text-blue-600" },
    services: { bg: "bg-amber-100", text: "text-amber-600" },
    products: { bg: "bg-emerald-100", text: "text-emerald-600" },
    default: { bg: "bg-red-100", text: "text-red-600" },
  };
  return styles[listingType] || styles.default;
};

const getCurrency = (currency) => {
  const symbols = { TL: "₺", USD: "$", EUR: "€" };
  return symbols[currency] || "";
};

export const ProductCard = ({ listing }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState("");

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: listing.name,
          text: listing.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    console.log("Listing liked:", newLikedState, "Listing ID:", listing.id);
  };

  const categoryStyles = getCategoryStyles(listing.listingType);

  return (
    <div className="group relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
      {/* Image Container - Fixed Height */}
      <div className="relative h-48 w-full overflow-hidden">
        {listing.imageUrls?.length > 0 ? (
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-2 top-2 flex space-x-2">
          <button
            className="relative h-8 w-8 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:bg-white"
            onClick={handleShare}
            onMouseEnter={() => setShowTooltip("share")}
            onMouseLeave={() => setShowTooltip("")}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
            {showTooltip === "share" && (
              <div className="absolute -bottom-8 right-0 z-10 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                Share listing
              </div>
            )}
          </button>

          <button
            className="relative h-8 w-8 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:bg-white"
            onClick={handleLike}
            onMouseEnter={() => setShowTooltip("like")}
            onMouseLeave={() => setShowTooltip("")}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
            {showTooltip === "like" && (
              <div className="absolute -bottom-8 right-0 z-10 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                {isLiked ? "Remove from favorites" : "Add to favorites"}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Content - Fixed Height */}
      <div className="flex h-[208px] flex-col p-4">
        <div className="mb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryStyles.bg} ${categoryStyles.text}`}
          >
            {listing.category}
          </span>
        </div>

        <div className="flex-grow overflow-hidden">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900">
            {listing.name}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-500">
            {listing.description}
          </p>
        </div>

        <div className="mt-auto border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-green-600">
              <Tag className="h-4 w-4" />
              <span className="text-base font-semibold">
                {listing?.price
                  ? `${getCurrency(listing.currency)}${listing.price}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{listing?.location || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
