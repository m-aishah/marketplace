"use client";
import React, { useState, useRef, useEffect } from "react";
import categories from "./categories";
import Image from "next/image";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
    <ProtectedRoute>
      <div className="w-full h-full flex justify-center items-center pb-28">
        <div className="w-[700px] h-full p-10 flex flex-col items-center">
          <div className="mb-10 self-start">
            <h1 className="text-black text-3xl font-semibold tracking-tight mb-2">
              Add Product
            </h1>
            <p className="text-gray-500 text-base font-light tracking-normal">
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
            <div className="w-full flex items-center p-5 bg-[#FAFAFA] mb-10 rounded-lg">
              <div className="w-[30%]">
                <p className="text-[#737373] text-lg font-light">
                  Product Picture
                </p>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div
                  onClick={handleImageClick}
                  className="h-[150px] cursor-pointer rounded-lg bg-brand/5 aspect-square mr-5 flex flex-col justify-center items-center hover:bg-gray-200"
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
                    <p className="text-base text-brand">Upload image</p>
                  )}
                </div>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <p className="text-[#737373] text-sm font-light">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                </p>
              </div>
            </div>

            <div className="w-full bg-[#FAFAFA] flex flex-col items-center gap-4 mb-4 p-5 rounded-lg">
              <div className="w-full flex justify-between items-center">
                <label
                  htmlFor="product-name"
                  className="text-lg font-light tracking-tight text-[#737373] w-[30%]"
                >
                  Name*
                </label>
                <input
                  className="flex-1 rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10"
                  id="product-name"
                  type="text"
                  placeholder="e.g Apple Wristwatch"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <label
                  htmlFor="product-description"
                  className="text-lg font-light tracking-tight text-[#737373] w-[30%]"
                >
                  Description*
                </label>
                <textarea
                  className="flex-1 rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10"
                  id="product-description"
                  placeholder="e.g Used Apple wristwatch in good condition"
                ></textarea>
              </div>
              <div className="w-full flex justify-between items-center">
                <label
                  htmlFor="product-price"
                  className="text-lg font-light tracking-tight text-[#737373] w-[30%]"
                >
                  Price*
                </label>
                <input
                  className="flex-1 rounded-md ring-2 ring-gray-300 p-2  placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10"
                  id="product-price"
                  type="number"
                  placeholder="e.g 500"
                />
              </div>
              <div className=" w-full flex justify-between items-center">
                <label
                  htmlFor="product-category"
                  className="text-lg font-light tracking-tight text-[#737373] w-[30%]"
                >
                  Category*
                </label>
                <div className="relative flex-1">
                  <button
                    id="product-category"
                    className="w-full ring-2 ring-gray-300 rounded-md bg-white text-left p-2 shadow text-base active:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {selectedOption}
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
                className="bg-brand text-white font-sans text-base font-normal tracking-tight py-2 px-4 rounded-lg hover:bg-brand/60 transition-colors"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CreateListing;
