import { FaUser, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function ContactProfileButtons({
  listing,
  setIsContactModalOpen,
}) {
  const [user] = useAuthState(auth);

  const getProfileLink = (userId) => {
    if (listing?.userId === userId) {
      return "/profile";
    }

    return `/profile/${listing?.userId}`;
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <button
        onClick={() => setIsContactModalOpen(true)}
        className="transition bg-blue-600 font-medium text-white px-6 py-3 rounded-full text-sm hover:bg-blue-700 hover:shadow-lg flex items-center justify-center"
      >
        <FaPhoneAlt className="mr-2" />
        Contact Advertiser
      </button>
      <Link
        href={getProfileLink(user?.uid)}
        className="transition bg-gray-200 font-medium text-gray-800 px-6 py-3 rounded-full text-sm hover:bg-gray-300 hover:shadow-lg flex items-center justify-center"
      >
        <FaUser className="mr-2" />
        Advertiser Profile
      </Link>
    </div>
  );
}
