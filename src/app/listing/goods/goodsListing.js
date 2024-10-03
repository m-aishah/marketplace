import { useState } from 'react';
import Image from 'next/image';

const GoodsListingPage = () => {

  const mockListing = {
    images: [
      '/images/goods/frontiphone16.jpg',
      '/images/goods/iphone16.jpg',
      '/images/goods/alliphones.jpg',
    ],
    name: 'iPhone 16',
    description: 'The latest iPhone 16 with advanced features and stunning design.',
    price: 999,
    category: 'Electronics',
    features: [
      '6.1-inch Super Retina XDR display',
      'A16 Bionic chip for powerful performance',
      'Dual-camera system with advanced photo capabilities',
      '5G capable for ultra-fast connectivity',
      'Ceramic Shield front cover for durability',
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockListing.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + mockListing.images.length) % mockListing.images.length
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-64">
        <Image
          src={mockListing.images[currentImageIndex]}
          alt={mockListing.name}
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

      {/* Product Details */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">{mockListing.name}</h1>
        <p className="mt-2 text-gray-600">{mockListing.description}</p>

        <div className="mt-4">
          <span className="text-gray-700 text-lg">Price:</span>
          <span className="ml-2 text-xl font-bold text-green-600">${mockListing.price}</span>
        </div>

        {/* Category */}
        <div className="mt-4">
          <span className="text-gray-700 text-lg">Category:</span>
          <span className="ml-2 text-lg text-gray-800">{mockListing.category}</span>
        </div>

        {/* Features List */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Key Features:</h2>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            {mockListing.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
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
