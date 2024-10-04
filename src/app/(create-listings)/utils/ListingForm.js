import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaChevronUp, FaChevronDown, FaUpload } from "react-icons/fa";
import { uploadListingImageToStorage } from "./uploadImageToStorage";
import { addListingToFirestore } from "./addListingToFirestore";
import { db } from "@/firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const ListingForm = ({ user, categories, listingType }) => {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Category");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const locationRef = useRef(null);
  const bedroomsRef = useRef(null);
  const bathroomsRef = useRef(null);
  const conditionRef = useRef(null);
  const fileInputRef = useRef(null);

  const getFormConfig = () => {
    switch (listingType) {
      case "apartments":
        return {
          title: "Apartment",
          namePlaceholder: "e.g. Cozy Studio in Downtown",
          descriptionPlaceholder:
            "Describe the apartment, its features, and location",
          pricePlaceholder: "Monthly rent",
          priceLabel: "Rent per month*",
          additionalFields: [
            {
              ref: locationRef,
              label: "Location*",
              type: "text",
              placeholder: "e.g. 123 Main St, City, State",
            },
            {
              ref: bedroomsRef,
              label: "Bedrooms*",
              type: "number",
              placeholder: "Number of bedrooms",
            },
            {
              ref: bathroomsRef,
              label: "Bathrooms*",
              type: "number",
              placeholder: "Number of bathrooms",
            },
          ],
        };
      case "goods":
        return {
          title: "Product",
          namePlaceholder: "e.g. Vintage Watch",
          descriptionPlaceholder:
            "Describe the item, its condition, and any unique features",
          pricePlaceholder: "Price",
          priceLabel: "Price*",
          additionalFields: [
            {
              ref: conditionRef,
              label: "Condition*",
              type: "text",
              placeholder: "e.g. New, Used, Like New",
            },
          ],
        };
      case "skills":
      default:
        return {
          title: "Skill",
          namePlaceholder: "e.g. Web Development",
          descriptionPlaceholder: "Describe your skill and experience",
          pricePlaceholder: "Hourly rate or fixed price",
          priceLabel: "Price*",
          additionalFields: [],
        };
    }
  };

  const formConfig = getFormConfig();

  const triggerFileInput = () => {
    fileInputRef.current.click(); // Programmatically trigger the hidden file input
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Get selected files as an array
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file), // Create a local URL for the image
      file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]); // Append to existing images
  };

  // Handle replacing an image
  const handleImageChange = (e, index) => {
    const file = e.target.files[0]; // Get the new file
    const updatedImages = [...images]; // Copy existing images
    updatedImages[index] = {
      url: URL.createObjectURL(file),
      file,
    }; // Replace the selected image
    setImages(updatedImages); // Update state
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Prepare the initial listing data without the image URL
      const listingData = {
        userId: user.uid,
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        price: parseFloat(priceRef.current.value),
        category: selectedOption,
        listingType: listingType,
      };

      // Add additional fields based on listing type
      if (listingType === "apartments") {
        listingData.location = locationRef.current.value;
        listingData.bedrooms = parseInt(bedroomsRef.current.value);
        listingData.bathrooms = parseInt(bathroomsRef.current.value);
      } else if (listingType === "goods") {
        listingData.condition = conditionRef.current.value;
      }

      // Create the listing in Firestore first
      const docRef = await addDoc(collection(db, "listings"), listingData);
      const listingId = docRef.id;

      // Now that we have the listingId, upload the image if there is one
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadListingImageToStorage(
          imageFile,
          user.uid,
          listingId
        );

        // Update the listing with the image URL
        await updateDoc(doc(db, "listings", listingId), { imageUrl: imageUrl });
      }

      // Reset form
      nameRef.current.value = "";
      descriptionRef.current.value = "";
      priceRef.current.value = "";
      setSelectedImages([]);
      document.getElementById("imageInput").value = "";
      // setSelectedImage(null);
      setImageFile(null);
      setSelectedOption("Category");
      formConfig.additionalFields.forEach((field) => {
        if (field.ref.current) field.ref.current.value = "";
      });
      toast.success(`${formConfig.title} uploaded successfully`);
    } catch (error) {
      console.error("Error adding listing: ", error);
      toast.error(`Error uploading ${formConfig.title.toLowerCase()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full gap-6 flex flex-col p-5 bg-[#FAFAFA] rounded-t-lg md:flex-row md:gap-0">
        <div className="w-full md:w-[30%]">
          <p className="text-[#737373] text-base font-light md:text-lg">
            {formConfig.title} Picture
          </p>
        </div>
        <div className="w-full flex flex-col md:justify-between md:flex-row md:flex-1 md:items-center">
          <p className="text-[#737373] text-sm font-light mt-6 md:mt-0">
            Image must be below 1024x1024px. Use PNG or JPG format. Click the
            upload icon below to upload as many images as desired.
          </p>
        </div>
      </div>

      <div className="w-full bg-[#FAFAFA] flex flex-col px-5 pb-5 mb-10 rounded-b-lg">
        <div className="flex justify-between items-center flex-wrap space-y-5">
          {images.map((image, index) => {
            return (
              <div key={index} className="relative">
                <div className="w-[150px] h-[150px]">
                  <Image
                    src={image.url}
                    alt={`Upload ${index}`}
                    width={150}
                    height={150}
                    className="rounded-lg w-full h-full object-cover"
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageChange(e, index)}
                />
              </div>
            );
          })}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div
          className="mt-5 self-end cursor-pointer"
          onClick={triggerFileInput}
        >
          <FaUpload className="text-brand text-base mb-2" />
        </div>
      </div>

      <div className="w-full bg-[#FAFAFA] flex flex-col items-center gap-4 mb-4 p-5 rounded-lg">
        <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
          <label
            htmlFor="listing-name"
            className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
          >
            Name*
          </label>
          <input
            className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
            id="listing-name"
            ref={nameRef}
            required
            type="text"
            placeholder={formConfig.namePlaceholder}
          />
        </div>
        <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
          <label
            htmlFor="listing-description"
            className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
          >
            Description*
          </label>
          <textarea
            className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
            id="listing-description"
            ref={descriptionRef}
            required
            placeholder={formConfig.descriptionPlaceholder}
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
          <label
            htmlFor="listing-price"
            className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
          >
            {formConfig.priceLabel}
          </label>
          <input
            className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
            id="listing-price"
            ref={priceRef}
            required
            type="number"
            step="0.01"
            min="0"
            placeholder={formConfig.pricePlaceholder}
          />
        </div>
        {formConfig.additionalFields.map((field, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row"
          >
            <label
              htmlFor={`listing-${field.label.toLowerCase()}`}
              className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
            >
              {field.label}
            </label>
            <input
              className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
              id={`listing-${field.label.toLowerCase()}`}
              ref={field.ref}
              required
              type={field.type}
              placeholder={field.placeholder}
            />
          </div>
        ))}
        <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
          <label
            htmlFor="listing-category"
            className="text-base font-light tracking-tight text-[#737373] w-[30%] md:text-lg"
          >
            Category*
          </label>
          <div className="relative w-full md:flex-1">
            <button
              id="listing-category"
              type="button"
              className="w-full flex justify-between items-center ring-2 ring-gray-300 rounded-md bg-white text-left p-2 shadow text-base active:ring-brand active:ring-opacity-60 active:shadow-lg active:shadow-brand/10"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {selectedOption}
              {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute w-full rounded shadow-lg top-10 text-base bg-white mt-3 z-10"
              >
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="cursor-pointer hover:bg-gray-100 p-2 active:bg-brand active:text-white"
                    onClick={() => handleClickCategories(category.name)}
                  >
                    <p>{category.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          className="w-full bg-brand text-white font-sans text-base font-normal tracking-tight py-2 px-4 rounded-lg hover:bg-brand/60 transition-colors md:w-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
