import { FaEnvelope, FaBriefcase, FaUserAlt } from 'react-icons/fa';
import Image from 'next/image';

const FreelancerServicePage = ({ skill }) => {
  if (!skill) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Centered loading spinner for better UX
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Freelancer Profile Section */}
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 p-4 rounded-full text-white">
          <FaUserAlt size={40} /> {/* Icon instead of profile picture */}
        </div>
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-gray-800">{skill.name || 'Freelancer Name'}</h1>
          <p className="text-gray-600">Professional Freelancer</p>
        </div>
      </div>

      {/* Services Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Service Offered</h2>
      <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50 shadow-md">
        <div className="flex items-center mb-4">
          <FaBriefcase className="text-blue-500 text-2xl" />
          <h3 className="text-xl font-bold text-gray-800 ml-3">{skill.category || 'Service Category'}</h3>
        </div>
        <p className="text-gray-700 text-lg mb-3">{skill.description || 'No description available.'}</p>
        <p className="text-xl font-bold text-blue-500 mb-1">
          {skill.price ? `₺${skill.price}` : 'Price not available'}
        </p>
        <p className="text-gray-600">Service provided by {skill.name || 'Freelancer'}</p>
      </div>

      {/* Image Gallery Section */}
      {skill.imageUrls && skill.imageUrls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Service Images:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skill.imageUrls.map((url, index) => (
              <div key={index} className="relative h-60">
                <Image
                  src={url}
                  alt={`Service Image ${index + 1}`}
                  layout="fill" // Use fill to fill the parent container
                  className="rounded-lg shadow-lg object-cover hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Contact Me:</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center shadow-lg transition-all duration-300">
          <FaEnvelope className="mr-2" />
          Send Message
        </button>
      </div>
    </div>
  );
};

export default FreelancerServicePage;
