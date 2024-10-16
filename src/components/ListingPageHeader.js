import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { FiPlus } from "react-icons/fi";

const Header = ({ title, setIsCreateModalOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 407);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile && <BackButton isMobile />}
      <div className="flex items-center justify-between mb-4 space-x-4">
        {!isMobile && <BackButton />}
        <h1
          className={`text-2xl font-semibold flex-grow ${
            isMobile ? "text-left" : "text-center"
          }`}
        >
          {title}
        </h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="transition font-medium text-sm rounded-full text-center bg-transparent text-black ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 px-4 py-2 lg:px-5 lg:py-3 inline-flex items-center justify-center"
        >
          <FiPlus className="mr-2 lg:h-5 lg:w-5 text-black" />
          <span className="text-black">New Listing</span>
        </Button>
      </div>
    </>
  );
};

const BackButton = ({ isMobile }) => {
  return (
    <div className={isMobile ? "flex justify-center w-full mb-4" : ""}>
      <Link
        href="/"
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
    </div>
  );
};

export default Header;
