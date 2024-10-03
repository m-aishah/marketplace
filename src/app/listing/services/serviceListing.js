import { FaStar, FaBriefcase, FaCode, FaPenNib, FaChartLine, FaPalette, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';

const FreelancerServicePage = () => {
  // Mock data for freelancer details
  const freelancer = {
    name: 'Abdelrahman',
    profilePicture: '/images/freelance/freelanceProfile.png',
    titles: 'Software Engineer * Proofreader * Cook',
    rating: 5.0,
    jobsCompleted: 5,
    services: [
      {
        title: 'Web Development',
        description: 'Creating responsive and modern websites.',
        price: '£300',
        details: 'Includes up to 5 pages, SEO optimized.',
        icon: <FaCode className="text-blue-500" />,
      },
      {
        title: 'Crypto Exchange',
        description: 'Buying and selling crypto.',
        price: '4% fees',
        details: 'Includes free fee on the first transaction',
        icon: <FaChartLine className="text-green-500" />,
      },
      {
        title: 'Writing Assignments',
        description: 'High-quality content writing for various topics.',
        price: '£50',
        details: '500 words, includes one revision.',
        icon: <FaPenNib className="text-yellow-500" />,
      },
      {
        title: 'Graphic Design',
        description: 'Professional logo and branding designs.',
        price: '£150',
        details: 'Includes 3 logo concepts and revisions.',
        icon: <FaPalette className="text-pink-500" />,
      },
    ],
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex items-center mb-5">
        <Image
          src={freelancer.profilePicture}
          alt={freelancer.name}
          width={100}
          height={100}
          className="rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{freelancer.name}</h1>
          <p className="text-gray-700">{freelancer.titles}</p>
          <p className="font-semibold flex items-center">
            <FaStar className="text-yellow-500 mr-1" /> 
            {freelancer.rating}/5 ({freelancer.jobsCompleted} jobs)
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Services Offered:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {freelancer.services.map((service, index) => (
          <div key={index} className="border rounded-lg p-4 shadow flex items-start">
            <div className="mr-4">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
              <p className="font-semibold mt-2">{service.price}</p>
              <p className="text-gray-600">{service.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-semibold">Contact Me:</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
          <FaEnvelope className="mr-2" />
          Send Message
        </button>
      </div>
    </div>
  );
};

export default FreelancerServicePage;
