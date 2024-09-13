"use client";
import React, { useState, useRef, useEffect } from "react";
import categories from "./categories";
import Image from "next/image";
import { FaChevronUp, FaChevronDown, FaUpload } from "react-icons/fa";

function CreateListing() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Category");
  const menuRef = useRef(null);

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickCategories = (category) => {
    closeMenu();
    setSelectedOption(category);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center pb-28">
      <div className="w-full h-full p-4 flex flex-col items-center md:w-[700px] md:p-10">
        <div className="mb-10 self-start">
          <h1 className="text-black text-xl md:text-3xl font-semibold tracking-tight mb-2">
            Add Product
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-light tracking-normal">
            Add details about your product and click the submit button to
            upload.
          </p>
        </div>

        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="w-full gap-6 flex flex-col p-5 bg-[#FAFAFA] mb-10 rounded-lg md:flex-row md:items-center md:gap-0">
            <div className="w-full md:w-[30%]">
              <p className="text-[#737373] text-base font-light md:text-lg">
                Product Picture
              </p>
            </div>
            <div className="w-full flex flex-col md:justify-between md:flex-row md:flex-1 md:items-center">
              <div
                onClick={handleImageClick}
                className="h-[150px] w-[150px] cursor-pointer rounded-lg bg-brand/5 flex flex-col justify-center items-center transition hover:bg-gray-200 md:aspect-square md:mr-5 md:w-auto"
              >
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    height={150}
                    width={150}
                    alt="selected image"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <FaUpload className="text-brand text-base mb-2" />
                    <p className="text-sm text-brand">Upload image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <p className="text-[#737373] text-sm font-light mt-6 md:mt-0">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>
          </div>

          <div className="w-full bg-[#FAFAFA] flex flex-col items-center gap-4 mb-4 p-5 rounded-lg">
            <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
              <label
                htmlFor="product-name"
                className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
              >
                Name*
              </label>
              <input
                className="w-full rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
                id="product-name"
                type="text"
                placeholder="e.g Apple Wristwatch"
              />
            </div>
            <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
              <label
                htmlFor="product-description"
                className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
              >
                Description*
              </label>
              <textarea
                className="w-full rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
                id="product-description"
                placeholder="e.g Used Apple wristwatch in good condition"
              ></textarea>
            </div>
            <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
              <label
                htmlFor="product-price"
                className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
              >
                Price*
              </label>
              <input
                className="w-full rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
                id="product-price"
                type="number"
                placeholder="e.g 500"
              />
            </div>
            <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
              <label
                htmlFor="product-category"
                className="text-base font-light tracking-tight text-[#737373] w-[30%] md:text-lg"
              >
                Category*
              </label>
              <div className="relative w-full md:flex-1">
                <button
                  id="product-category"
                  className="w-full flex justify-between items-center ring-2 ring-gray-300 rounded-md bg-white text-left p-2 shadow text-base active:ring-brand active:ring-opacity-60 active:shadow-lg active:shadow-brand/10"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  {selectedOption}
                  {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute w-full rounded shadow-lg top-10 text-base bg-white mt-3"
                  >
                    {categories.map((category) => {
                      return (
                        <div
                          key={category.id}
                          className="cursor-pointer hover:bg-gray-100 p-2 active:bg-brand active:text-white"
                          onClick={() => {
                            handleClickCategories(category.name);
                          }}
                        >
                          <p>{category.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              className="w-full bg-brand text-white font-sans text-base font-normal tracking-tight py-2 px-4 rounded-lg hover:bg-brand/60 transition-colors md:w-auto"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;
