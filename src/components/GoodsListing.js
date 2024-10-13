import { useState } from 'react';
import Image from 'next/image';

const GoodsListingPage = ({ listing }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ensure imageUrls is defined and has at least one image
  const imageUrls = listing?.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : null;

  const handleNextImage = () => {
    if (imageUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }
  };

  const handlePrevImage = () => {
    if (imageUrls) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex - 1 + imageUrls.length) % imageUrls.length
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Conditionally render the image section if imageUrls exists */}
      {imageUrls && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrls[currentImageIndex]}  // Use the actual image URLs from listing data
            alt={listing?.name || 'Product Image'}
            layout="fill" 
            objectFit="cover" 
            className="rounded-lg"
          />
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            &#9664;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            &#9654;
          </button>
        </div>
      )}

      {/* Product Details */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">{listing?.name || 'Product Name'}</h1>
        <p className="mt-2 text-gray-600">{listing?.description || 'Product Description'}</p>

        <div className="mt-4">
          <span className="text-gray-700 text-lg">Price:</span>
          <span className="ml-2 text-xl font-bold text-green-600">${listing?.price || 'N/A'}</span>
        </div>

        {/* Category */}
        <div className="mt-4">
          <span className="text-gray-700 text-lg">Category:</span>
          <span className="ml-2 text-lg text-gray-800">{listing?.category || 'Unknown'}</span>
        </div>

        {/* Contact Seller Button */}
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoodsListingPage;
