import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import {
  FaChevronUp,
  FaChevronDown,
  FaUpload,
  FaTrash,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import { uploadListingImageToStorage } from "@/utils/firestoreUtils";
import { db } from "@/firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/firebase";

const ListingForm = ({ user, categories, listingType, listingData }) => {
  const router = useRouter();
  const [formMode, setFormMode] = useState(listingData ? "edit" : "create");
  const [images, setImages] = useState(listingData?.imageUrls || []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    listingData?.category || "Category"
  );
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
          namePlaceholder: "e.g. Web Development",
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

  const handleImageUpload = (e) => {
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

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
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
        listingType,
        createdAt: new Date().toISOString(),
      };

      // Handle apartment/goods specific fields
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

      // Determine if we're editing or creating
      if (formMode === "edit") {
        listingId = listingData.id;
        await updateDoc(doc(db, "listings", listingId), newListingData);
      } else {
        const docRef = await addDoc(collection(db, "listings"), newListingData);
        listingId = docRef.id;
      }

      let imageUrls = [...(listingData?.imageUrls || [])];

      // Upload new images
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        if (image.file) {
          const imageUrl = await uploadListingImageToStorage(
            image.file,
            user.uid,
            listingId,
            index
          );
          imageUrls.push(imageUrl);
        }
      }

      // Delete images from Firestore Storage if needed
      if (deletedImages.length > 0) {
        const promises = deletedImages.map(async (imageUrl) => {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        });

        // Wait for all deletion promises to complete
        await Promise.all(promises);
        imageUrls = imageUrls.filter((url) => !deletedImages.includes(url));
      }

      // Update Firestore with the new imageUrls
      await updateDoc(doc(db, "listings", listingId), { imageUrls });

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
        <div className="w-full md:w-[30%]">
          <p className="text-[#737373] text-base font-light md:text-lg">
            {formConfig.title} Picture
          </p>
        </div>
      </div>

      <div className="w-full bg-[#FAFAFA] flex flex-col px-5 pb-5 mb-10 rounded-b-lg">
        <div
          className="w-full border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center p-5 cursor-pointer hover:border-brand transition-colors"
          onClick={triggerFileInput}
        >
          <div className="flex gap-4 flex-wrap items-center justify-center">
            {images.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Click or drag images here
                </p>
                <p className="text-xs text-gray-400">
                  JPEG or PNG only (Max: 10MB)
                </p>
              </div>
            ) : (
              images.map((image, index) => (
                <div key={index} className="relative group w-[150px] h-[150px]">
                  <Image
                    src={image.file ? image.url : image}
                    alt={`Upload ${index}`}
                    width={150}
                    height={150}
                    className="rounded-lg w-full h-full object-cover"
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
                    onClick={() => openModal(image.url)}
                  >
                    <FaExpand className="text-white" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
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
          <Modal onClose={closeModal}>
            {modalImage && (
              <div className="flex flex-col p-2 gap-5 md:p-6">
                <div onClick={closeModal} className="flex justify-end">
                  <FaTimes className="text-lg" />
                </div>
                <Image
                  src={modalImage}
                  alt="Full image"
                  width={0}
                  height={0}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </Modal>
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
