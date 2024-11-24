import React, { useState, useEffect, useCallback, useRef } from "react";
import NextImage from "next/image";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return debouncedCallback;
};

const ImageGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef(null);
  const modalRef = useRef(null);
  const imageCache = useRef(new Set());

  const preloadImages = useCallback(() => {
    images.forEach((url) => {
      if (!imageCache.current.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageCache.current.add(url);
        };
      }
    });
  }, [images]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const handleImageNavigation = useCallback((direction) => {
    setIsLoading(true);
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
  }, [currentImageIndex, images.length]);

  const handleNextImage = useCallback((e) => {
    e.stopPropagation();
    handleImageNavigation('next');
  }, [handleImageNavigation]);

  const handlePrevImage = useCallback((e) => {
    e.stopPropagation();
    handleImageNavigation('prev');
  }, [handleImageNavigation]);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Handle click outside
  const handleModalClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeFullscreen();
    }
  }, [closeFullscreen]);

  const scrollToThumbnail = useDebounce((index) => {
    const thumbnail = document.querySelector(`[data-thumbnail-index="${index}"]`);
    if (thumbnail && carouselRef.current) {
      carouselRef.current.scrollTo({
        left: thumbnail.offsetLeft - carouselRef.current.offsetWidth / 2 + thumbnail.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, 100);

  useEffect(() => {
    scrollToThumbnail(currentImageIndex);
  }, [currentImageIndex, scrollToThumbnail]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isFullscreen) {
        if (e.key === "ArrowRight") handleImageNavigation('next');
        if (e.key === "ArrowLeft") handleImageNavigation('prev');
        if (e.key === "Escape") closeFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, handleImageNavigation, closeFullscreen]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleImageNavigation('next'),
    onSwipedRight: () => handleImageNavigation('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  const NavigationButton = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{
        [direction === 'left' ? 'left' : 'right']: '1rem'
      }}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      ) : (
        <ChevronRight className="w-6 h-6 text-gray-800" />
      )}
    </button>
  );

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        {/* <p className="text-gray-500">No images available</p> */}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: "75%" }}
      >
        <div
          {...swipeHandlers}
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <NextImage
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="cover"
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, 800px"
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        {/* Image Counter Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <span className="text-white text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </span>
        </div>

        {/* Navigation Arrows */}
        {images.length > 2 && (
          <>
            <NavigationButton direction="left" onClick={handlePrevImage} />
            <NavigationButton direction="right" onClick={handleNextImage} />
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div
        ref={carouselRef}
        className="mt-4 overflow-x-auto flex space-x-2 pb-2 scrollbar-hide"
      >
        {images.map((url, index) => (
          <button
            key={index}
            data-thumbnail-index={index}
            className={`relative w-20 h-20 rounded-lg overflow-hidden focus:outline-none transform transition-all duration-200 ${
              index === currentImageIndex
                ? "ring-2 ring-blue-500 scale-105"
                : "ring-1 ring-gray-200 hover:ring-blue-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <NextImage
              src={url}
              alt={`Thumbnail ${index + 1}`}
              layout="fill"
              objectFit="cover"
              quality={60}
              className="transition-transform duration-300 hover:scale-105"
              loading="eager"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onClick={handleModalClick}
        >
          <div 
            ref={modalRef}
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
          >
            <button
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200 z-50"
              onClick={closeFullscreen}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Navigation Arrows in Fullscreen */}
            {images.length > 2 && (
              <>
                <NavigationButton direction="left" onClick={handlePrevImage} />
                <NavigationButton direction="right" onClick={handleNextImage} />
              </>
            )}

            <div className="relative w-full h-full">
              <NextImage
                src={images[currentImageIndex]}
                alt={`Fullscreen Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                quality={100}
                priority
                className={`select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;