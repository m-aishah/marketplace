import { useState } from 'react';
import { FaBed, FaBath, FaExpandArrowsAlt, FaHome } from 'react-icons/fa'; 
import QuickView from './quickView';
import Image from "next/image";

const ApartmentListingPage = () => {
  // Mock data for the apartment listing
  const mockApartment = {
    images: [
      '/images/apartments/lefkaSeating.jpeg',
      '/images/apartments/lefkaBed.jpeg', 
      '/images/apartments/lefkaLiving.jpeg',
    ],
    title: 'Lefke - 2+1 Apartment for Rent',
    price: '$5000 (~150,100₺)',
    location: 'Lefke, close to EUL',
    propertyType: 'Flat',
    rooms: '2+1',
    baths: 'x1',
    area: '95 m²',
    description: `Lefke - 2+1 for Rent 💳 5000 Dollars 🔑 500 Dollar Deposit 🔑 100 Dollar Commission 
                  ‼️ Only Annual Payment ‼️‼️ Very Close to School and Bus Stops ‼️‼️ Central Location`,
    quickView: {
      adNo: ' #388038',
      status: ' To Rent',
      titleType: ' Turkish Title Deeds',
      swap: ' Not Available',
      buildingAge: '3',
      gatedCommunity: 'No',
      floorsCount: '4',
      floorNumber: '2',
      furnished: 'Furnished',
      minRentalPeriod: '6 Months',
      publishedOn: '24/08/2024',
      lastUpdated: '24/09/2024',
    },
  };

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % mockApartment.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? mockApartment.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Slideshow Section */}
      <div className="relative">
        <Image
          src={mockApartment.images[currentImage]}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto'}} 
          alt="Apartment"
          className="object-cover w-full h-64"
        />
        {/* Previous and Next Buttons */}
        <button
          className="absolute top-1/2 left-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          onClick={prevImage}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          onClick={nextImage}
        >
          &#10095;
        </button>
      </div>

      {/* Apartment Details */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">{mockApartment.title}</h1>
        <p className="mt-2 text-gray-600">{mockApartment.location}</p>
        <p className="mt-2 text-green-600 text-xl">{mockApartment.price}</p>

        {/* Amenities Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Amenities:</h2>
          <div className="grid grid-cols-2 gap-4 mt-2 pl-6">
            <p className="flex items-center">
              <FaHome className="mr-2" /> {mockApartment.propertyType}
            </p>
            <p className="flex items-center">
              <FaBed className="mr-2" /> {mockApartment.rooms}
            </p>
            <p className="flex items-center">
              <FaBath className="mr-2" /> {mockApartment.baths}
            </p>
            <p className="flex items-center">
              <FaExpandArrowsAlt className="mr-2" /> {mockApartment.area}
            </p>
          </div>
        </div>

        {/* Apartment Description */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Description:</h2>
          <p className="mt-2 text-gray-600 whitespace-pre-line">{mockApartment.description}</p>
        </div>

        {/* Property Details Section */}
        <div className="container mx-auto p-4">
          <QuickView quickViewData={mockApartment.quickView} />
        </div>

        {/* Contact Button */}
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none">
            Contact Advertiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApartmentListingPage;
