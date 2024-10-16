import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaChevronUp,
  FaChevronDown,
  FaUpload,
  FaTrash,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import {
  uploadListingImageToStorage,
  uploadListingVideoToStorage,
} from "@/utils/firestoreUtils";
import { db } from "@/firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/firebase";

const ListingForm = ({
  user,
  categories,
  currencies,
  listingType,
  listingData,
}) => {
  const router = useRouter();
  const [formMode, setFormMode] = useState(listingData ? "edit" : "create");
  const [images, setImages] = useState(listingData?.imageUrls || []);
  const [videos, setVideos] = useState(listingData?.videoUrls || []);
  const [deletedVideos, setDeletedVideos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [modalMediaType, setModalMediaType] = useState(null);
  const [modalImage, setModalImage] = useState(null);
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
  const bedroomsRef = useRef(null);
  const bathroomsRef = useRef(null);
  const conditionRef = useRef(null);
  const serviceRef = useRef(null);
  const serviceTitleRef = useRef(null);
  const serviceDetailsRef = useRef(null);
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
      case "services":
      default:
        return {
          title: "Service",
          namePlaceholder: "e.g. Aishah",
          descriptionPlaceholder: "Describe your service and experience",

          pricePlaceholder: "Hourly rate or fixed price",
          priceLabel: "Price*",
          additionalFields: [
            {
              ref: serviceRef,
              label: "Service*",
              type: "text",
              placeholder: "e.g. Web Development",
            },
            {
              ref: serviceTitleRef,
              label: "Title*",
              type: "text",
              placeholder: "e.g. Web Developer",
            },
            {
              ref: serviceDetailsRef,
              label: "Details*",
              type: "text",
              placeholder: "What does your service include?",
            },
          ],
        };
    }
  };
  const formConfig = getFormConfig();

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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const isValidSize = file.size <= 10 * 1024 * 1024;
    const isValidType = file.type === "image/jpeg" || file.type === "image/png";

    if (!isValidSize || !isValidType) {
      const errorMessages = `${
        !isValidSize ? "Image must be less than 10MB.\n" : ""
      }${!isValidType ? "Only JPEG and PNG formats are allowed.\n" : ""}`;
      toast.error(errorMessages);
    } else {
      const updatedImages = [...images];
      updatedImages[index] = {
        url: URL.createObjectURL(file),
        file,
      };
      setImages(updatedImages);
    }
  };

  const handleVideoChange = (e, index) => {
    const file = e.target.files[0];
    const isValidSize = file.size <= 50 * 1024 * 1024;
    const isValidType = file.type === "video/mp4" || file.type === "video/avi";

    if (!isValidSize || !isValidType) {
      const errorMessages = `${
        !isValidSize ? "Video must be less than 50MB.\n" : ""
      }${!isValidType ? "Only MP4 and AVI formats are allowed.\n" : ""}`;
      toast.error(errorMessages);
    } else {
      const updatedVideos = [...videos];
      updatedVideos[index] = {
        url: URL.createObjectURL(file),
        file,
      };
      setVideos(updatedVideos);
    }
  };

  const handleDeleteImage = (index) => {
    const imageToDelete = images[index];

    if (imageToDelete.file) {
      // Remove newly uploaded image from state
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      // Track the URL to be deleted from Firestore Storage
      const imageToDeleteUrl = listingData.imageUrls[index];
      setDeletedImages((prevDeleted) => [...prevDeleted, imageToDeleteUrl]);
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const handleDeleteVideo = (index) => {
    const videoToDelete = videos[index];

    if (videoToDelete.file) {
      // Remove newly uploaded video from state
      setVideos((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      // Track the URL to be deleted from Firestore Storage
      const videoToDeleteUrl = listingData.videoUrls[index]; //confirm this code
      setDeletedVideos((prevDeleted) => [...prevDeleted, videoToDeleteUrl]);
      setVideos((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const openModal = (media, type) => {
    setModalMedia(media);
    setModalMediaType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // setModalImage(null);
    setModalMedia(null);
    setModalMediaType(null);
    setIsModalOpen(false);
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
      if (listingType === "apartments") {
        locationRef.current.value = listingData.location || "";
        bedroomsRef.current.value = listingData.bedrooms || "";
        bathroomsRef.current.value = listingData.bathrooms || "";
      } else if (listingType === "goods") {
        conditionRef.current.value = listingData.condition || "";
      } else if (listingType === "services") {
        serviceRef.current.value = listingData.service || "";
        serviceTitleRef.current.value = listingData.serviceTitle || "";
        serviceDetailsRef.current.value = listingData.serviceDetails || "";
      }
    }
  }, [listingData, listingType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const newListingData = {
        userId: user.uid,
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        price: parseFloat(priceRef.current.value),
        category: selectedOption,
        currency: selectedCurrency,
        listingType,
        createdAt: new Date().toISOString(),
      };

      if (listingType === "apartments") {
        newListingData.location = locationRef.current.value;
        newListingData.bedrooms = parseInt(bedroomsRef.current.value);
        newListingData.bathrooms = parseInt(bathroomsRef.current.value);
      } else if (listingType === "goods") {
        newListingData.condition = conditionRef.current.value;
      } else if (listingType === "services") {
        newListingData.service = serviceRef.current.value;
        newListingData.serviceTitle = serviceTitleRef.current.value;
        newListingData.serviceDetails = serviceDetailsRef.current.value;
      }

      let listingId;

      if (formMode === "edit") {
        listingId = listingData.id;
        await updateDoc(doc(db, "listings", listingId), newListingData);
      } else {
        const docRef = await addDoc(collection(db, "listings"), newListingData);
        listingId = docRef.id;
      }

      let imageUrls = [...(listingData?.imageUrls || [])];
      let videoUrls = [...(listingData?.videoUrls || [])];

      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        if (image.file) {
          const imageUrl = await uploadListingImageToStorage(
            image.file,
            user.uid,
            listingId,
            index
          );
          if (imageUrl) imageUrls.push(imageUrl);
        }
      }

      for (let index = 0; index < videos.length; index++) {
        const video = videos[index];
        if (video.file) {
          const videoUrl = await uploadListingVideoToStorage(
            video.file,
            user.uid,
            listingId,
            index
          );
          if (videoUrl) videoUrls.push(videoUrl);
        }
      }

      // Delete images from Firestore Storage if needed
      if (deletedImages.length > 0) {
        const promises = deletedImages.map(async (imageUrl) => {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        });

        await Promise.all(promises);
        imageUrls = imageUrls.filter((url) => !deletedImages.includes(url));
      }

      // Delete videos from Firestore Storage if needed
      if (deletedVideos.length > 0) {
        const promises = deletedVideos.map(async (videoUrl) => {
          const videoRef = ref(storage, videoUrl);
          await deleteObject(videoRef);
        });

        await Promise.all(promises);
        videoUrls = videoUrls.filter((url) => !deletedVideos.includes(url));
      }

      // Update Firestore with the new imageUrls and videoUrls
      await updateDoc(doc(db, "listings", listingId), { imageUrls, videoUrls });

      toast.success(
        `${formConfig.title} ${
          formMode === "edit" ? "updated" : "created"
        } successfully`
      );

      // Handle UI after successful edit or creation
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

      <div className="w-full bg-[#FAFAFA] flex flex-col px-5 pb-5 mb-10 rounded-b-lg">
        <div className="w-full border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center p-5 cursor-pointer hover:border-brand transition-colors">
          <div className="flex gap-4 flex-wrap items-center justify-center">
            {images.length === 0 && videos.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Click the icon to upload images and videos here.
                </p>
                <p className="text-xs text-gray-400">
                  JPEG or PNG only (Max: 10MB) MP4 or AVI only (Max: 50MB)
                </p>
              </div>
            ) : (
              <>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group w-[150px] h-[150px]"
                  >
                    <Image
                      src={image.file ? image.url : image}
                      alt={`Upload ${index}`}
                      width={150}
                      height={150}
                      className="rounded-lg w-full h-full object-cover"
                      onClick={triggerFileInput}
                    />
                    <div className="absolute cursor-pointer rounded-lg inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">Change Image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    <button
                      className="absolute bottom-2 left-2 bg-brand p-2 rounded-full hover:opacity-80"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <FaTrash className="text-white" />
                    </button>
                    <button
                      className="absolute bottom-2 right-2 bg-brand p-2 rounded-full hover:opacity-80"
                      onClick={() => openModal(image.url, "image")}
                    >
                      <FaExpand className="text-white" />
                    </button>
                  </div>
                ))}

                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="relative group w-[150px] h-[150px]"
                  >
                    <video
                      autoPlay
                      muted
                      loop
                      src={video.file ? video.url : video}
                      alt={`Upload ${index}`}
                      width={150}
                      height={150}
                      className="rounded-lg w-full h-full object-cover"
                      onClick={triggerFileInput}
                    />
                    <div className="absolute cursor-pointer rounded-lg inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">Change Video</p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleVideoChange(e, index)}
                    />
                    <button
                      className="absolute bottom-2 left-2 bg-brand p-2 rounded-full hover:opacity-80"
                      onClick={() => handleDeleteVideo(index)}
                    >
                      <FaTrash className="text-white" />
                    </button>
                    <button
                      className="absolute bottom-2 right-2 bg-brand p-2 rounded-full hover:opacity-80"
                      onClick={() => openModal(video.url, "video")}
                    >
                      <FaExpand className="text-white" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*, video/*"
          onChange={handleFileUpload}
        />

        <div className="mt-5 self-end">
          <FaUpload
            className="text-brand text-base mb-2 cursor-pointer"
            onClick={triggerFileInput}
          />
        </div>
      </div>

      <div className="w-full bg-[#FAFAFA] flex flex-col items-center gap-4 mb-4 p-5 rounded-lg">
        {/* Modal to show full images */}
        {isModalOpen && (
          <div className="fixed w-full top-0 left-0 min-h-screen bg-black/95 z-50 flex flex-col justify-center items-center">
            {modalMedia && (
              <div className="flex flex-col gap-2 max-w-[1000px] w-full p-4">
                <div onClick={closeModal} className="flex justify-end">
                  <FaTimes className="text-lg cursor-pointer text-white" />
                </div>
                {modalMediaType === "image" ? (
                  <Image
                    src={modalMedia}
                    alt="Full image"
                    width={0}
                    height={0}
                    className="w-full h-auto object-cover rounded-lg shadow-lg shadow-white/10"
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    src={modalMedia}
                    alt="Full videos"
                    className="w-full h-auto object-cover rounded-lg shadow-white/10"
                  />
                )}
              </div>
            )}
          </div>
        )}

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
            htmlFor="listing-category"
            className="text-base font-light tracking-tight text-[#737373] w-[30%] md:text-lg"
          >
            Currency*
          </label>
          <div className="relative w-full md:flex-1">
            <button
              id="listing-category"
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
