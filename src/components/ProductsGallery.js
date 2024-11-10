import React, { useState } from 'react';
import Image from 'next/image';

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative w-full h-64 md:h-96 mb-4">
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{backgroundImage: `url(${images[currentImageIndex]})`}}
        ></div>
        <div className="relative z-10 w-full h-full flex justify-center items-center">
          <Image
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            className="rounded-lg object-contain"
          />
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {images.map((url, index) => (
          <div
            key={index}
            className={`flex-shrink-0 cursor-pointer ${
              index === currentImageIndex ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleImageClick(index)}
          >
            <div className="relative w-20 h-20">
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{backgroundImage: `url(${url})`}}
              ></div>
              <Image
                src={url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="rounded relative z-10 object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-50"
              style={{backgroundImage: `url(${images[currentImageIndex]})`}}
            ></div>
            <div className="relative z-10 w-full h-full flex justify-center items-center">
              <Image
                src={images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;