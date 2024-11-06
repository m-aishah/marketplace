import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronUp, FaChevronDown, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  saveListingData,
  uploadMediaFiles,
  deleteMediaFromStorage,
} from "@/utils/firestoreUtils";
import { getFormConfig } from "./formConfig";
import MediaInput from "./mediaInput";

const ListingForm = ({
  user,
  categories,
  currencies,
  listingType,
  listingData,
}) => {
  const router = useRouter();
  const formConfig = getFormConfig(listingType);

  const [formMode, setFormMode] = useState(listingData ? "edit" : "create");
  const [images, setImages] = useState(listingData?.imageUrls || []);
  const [videos, setVideos] = useState(listingData?.videoUrls || []);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    listingData?.category || "Category"
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    listingData?.currency || "Currency"
  ); //confirm this code
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const locationRef = useRef(null);
  const additionalRefs = formConfig.additionalFields.reduce((refs, field) => {
    refs[field.refName] = useRef(null);
    return refs;
  }, {});
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMessages = "";

    files.forEach((file) => {
      const isValidSize = file.size <= 50 * 1024 * 1024;
      const isValidType =
        file.type === "video/mp4" || file.type === "video/avi";

      if (!isValidSize) {
        errorMessages += "Video must be less than 50MB.\n";
      }
      if (!isValidType) {
        errorMessages += "Only MP4 and AVI formats are allowed.\n";
      }

      if (isValidSize && isValidType) {
        validFiles.push(file);
      }
    });

    if (errorMessages) {
      toast.error(errorMessages);
    } else {
      const newVideos = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setVideos((prevImages) => [...prevImages, ...newVideos]);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videoFiles = selectedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (imageFiles.length > 0) {
      handleImageUpload(e);
    }

    if (videoFiles.length > 0) {
      handleVideoUpload(e);
    }
  };

  const handleImageUpload = (e) => {
    // console.log(images);
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMessages = "";

    files.forEach((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024;
      const isValidType =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isValidSize) {
        errorMessages += "Image must be less than 10MB.\n";
      }
      if (!isValidType) {
        errorMessages += "Only JPEG and PNG formats are allowed.\n";
      }

      if (isValidSize && isValidType) {
        validFiles.push(file);
      }
    });

    if (errorMessages) {
      toast.error(errorMessages);
    } else {
      const newImages = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeMenuCurrency = () => {
    setIsCurrencyMenuOpen(false);
  };

  const handleClickCategories = (category) => {
    closeMenu();
    setSelectedOption(category);
  };

  const handleClickCurrencies = (currency) => {
    closeMenuCurrency();
    setSelectedCurrency(currency);
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

  useEffect(() => {
    if (listingData) {
      setFormMode("edit");

      nameRef.current.value = listingData.name || "";
      descriptionRef.current.value = listingData.description || "";
      priceRef.current.value = listingData.price || "";
      locationRef.current.value = listingData.location || "";

      formConfig.additionalFields.forEach((field) => {
        const additionalRef = additionalRefs[field.refName];
        if (additionalRef && listingData[field.title]) {
          additionalRef.current.value = listingData[field.title];
        }
      });
    }
  }, [listingData, listingType, formConfig, additionalRefs]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    // Verify that both currency and category are selected
    if (selectedCurrency === "Currency" || selectedOption === "Category") {
      toast.error("Please select both a currency and a category.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare listing data based on listing type
      const newListingData = {
        userId: user.uid,
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        price: parseFloat(priceRef.current.value),
        category: selectedOption,
        currency: selectedCurrency,
        listingType,
        location: locationRef.current.value,
        createdAt: new Date().toISOString(),
      };

      // Add specific fields based on listing type
      formConfig.additionalFields.forEach((field) => {
        newListingData[field.title] =
          additionalRefs[field.refName].current.value;
      });

      // Save listing data to Firestore and retrieve listing ID
      const listingId = await saveListingData(
        newListingData,
        formMode,
        listingData?.id
      );

      // Handle image and video uploads
      const newImageUrls = await uploadMediaFiles(
        images,
        user.uid,
        listingId,
        "image"
      );
      const newVideoUrls = await uploadMediaFiles(
        videos,
        user.uid,
        listingId,
        "video"
      );

      // Merge newly uploaded URLs with existing ones
      let imageUrls = [...(listingData?.imageUrls || []), ...newImageUrls];
      let videoUrls = [...(listingData?.videoUrls || []), ...newVideoUrls];

      // Remove deleted media URLs from Firestore if necessary
      if (deletedImages.length) {
        await deleteMediaFromStorage(deletedImages);
        imageUrls = imageUrls.filter((url) => !deletedImages.includes(url));
      }
      if (deletedVideos.length) {
        await deleteMediaFromStorage(deletedVideos);
        videoUrls = videoUrls.filter((url) => !deletedVideos.includes(url));
      }

      // Update Firestore with the final media URLs
      await saveListingData({ imageUrls, videoUrls }, "edit", listingId);

      toast.success(
        `${formConfig.title} ${
          formMode === "edit" ? "updated" : "created"
        } successfully`
      );

      // Redirect to profile page after successful form submission
      router.push("/profile");
    } catch (error) {
      console.error("Error saving listing: ", error);
      toast.error(
        `Error ${
          formMode === "edit" ? "updating" : "creating"
        } ${formConfig.title.toLowerCase()}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full gap-2 flex flex-col p-5 bg-[#FAFAFA] rounded-t-lg md:flex-row md:gap-0">
        <div className="w-full">
          <p className="text-[#737373] text-base font-light md:text-lg">
            {formConfig.title} Picture and (or) Video
          </p>
        </div>
      </div>

      <MediaInput
        images={images}
        videos={videos}
        setImages={setImages}
        setVideos={setVideos}
        setDeletedImages={setDeletedImages}
        setDeletedVideos={setDeletedVideos}
        handleFileUpload={handleFileUpload}
      />

      <div className="w-full bg-[#FAFAFA] flex flex-col items-center gap-4 mb-4 p-5 rounded-lg">
        <div className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row">
          <label
            htmlFor="listing-name"
            className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
          >
            Title*
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
            htmlFor="listing-location"
            className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
          >
            Location*
          </label>
          <input
            className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
            id="listing-location"
            ref={locationRef}
            required
            type="text"
            placeholder="e.g. 123 Main St, City, State"
          />
        </div>
        <div className="w-full flex">
          <div className="flex-1 mr-4 sm:mr-20">
            <label
              htmlFor="listing-price"
              className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg "
            >
              {formConfig.priceLabel}
            </label>
            <input
              className="w-full mt-1 rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
              id="listing-price"
              ref={priceRef}
              required={listingType !== "requests"}
              type="number"
              step="0.01"
              min="0"
              placeholder={formConfig.pricePlaceholder}
            />
          </div>
          <div className="w-[50%] sm:w-[30%]">
            <label
              htmlFor="listing-currency"
              className="text-base font-light tracking-tight text-[#737373] w-[30%] md:text-lg"
            >
              Currency*
            </label>
            <div className="mt-1 relative w-full md:flex-1">
              <button
                id="listing-currency"
                type="button"
                className="w-full flex justify-between items-center ring-2 ring-gray-300 rounded-md bg-white text-left p-2 shadow text-base active:ring-brand active:ring-opacity-60 active:shadow-lg active:shadow-brand/10"
                onClick={() => setIsCurrencyMenuOpen((prev) => !prev)}
              >
                {selectedCurrency}
                {isCurrencyMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isCurrencyMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute w-full rounded shadow-lg top-10 text-base bg-white mt-3 z-10"
                >
                  {currencies.map((currency) => (
                    <div
                      key={currency.id}
                      className="cursor-pointer hover:bg-gray-100 p-2 active:bg-brand active:text-white"
                      onClick={() => handleClickCurrencies(currency.name)}
                    >
                      <p>{currency.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {formConfig.additionalFields.map((field, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 md:gap-0 md:justify-between md:items-center md:flex-row"
          >
            <label
              htmlFor={`listing-${field.title}`}
              className="text-base w-full font-light tracking-tight text-[#737373] md:w-[30%] md:text-lg"
            >
              {field.label}
            </label>
            <input
              className="w-full rounded-md ring-2 ring-gray-300 p-2 placeholder-gray-400 text-base shadow focus:outline-none focus:ring-brand focus:ring-opacity-60 focus:shadow-lg focus:shadow-brand/10 md:flex-1"
              id={`listing-${field.title}`}
              ref={additionalRefs[field.refName]}
              required={field.required}
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

      <div className="w-full flex justify-end mt-6">
        <button
          className="w-full bg-brand text-white font-sans text-base font-normal tracking-tight py-2 px-4 rounded-lg hover:bg-brand/60 transition-colors md:w-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : formMode === "edit"
            ? "Update"
            : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
