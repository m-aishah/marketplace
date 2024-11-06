import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaTrashAlt, FaExpandAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

export const MediaDisplayBox = ({
  images,
  videos,
  setImages,
  setVideos,
  setDeletedImages,
  setDeletedVideos,
  listingData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [modalMediaType, setModalMediaType] = useState(null);
  const fileInputRef = useRef(null);

  const triggerFileInput = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const openModal = (media, type) => {
    setModalMedia(media);
    setModalMediaType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalMedia(null);
    setModalMediaType(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (e, index) => {
    e.preventDefault();
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
    e.preventDefault();
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

  const handleDeleteImage = (index, e) => {
    e.preventDefault();
    const imageToDelete = images[index];

    if (imageToDelete.file) {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      const imageToDeleteUrl = listingData.imageUrls[index];
      setDeletedImages((prevDeleted) => [...prevDeleted, imageToDeleteUrl]);
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const handleDeleteVideo = (index, e) => {
    e.preventDefault();
    const videoToDelete = videos[index];

    if (videoToDelete.file) {
      setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    } else {
      const videoToDeleteUrl = listingData.videoUrls[index];
      setDeletedVideos((prevDeleted) => [...prevDeleted, videoToDeleteUrl]);
      setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <div className="w-full border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center p-5 cursor-pointer hover:border-brand transition-colors">
        <div className="flex gap-4 flex-wrap items-center justify-center">
          {images.length === 0 && videos.length === 0 ? (
            <div className="text-center" onClick={triggerFileInput}>
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
                <div key={index} className="relative group w-[150px] h-[150px]">
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
                    onClick={(e) => handleDeleteImage(index, e)}
                  >
                    <FaTrashAlt className="text-white" />
                  </button>
                  <button
                    className="absolute bottom-2 right-2 bg-brand p-2 rounded-full hover:opacity-80"
                    onClick={(e) =>
                      openModal(image.file ? image.url : image, "image")
                    }
                    type="button"
                  >
                    <FaExpandAlt className="text-white" />
                  </button>
                </div>
              ))}

              {videos.map((video, index) => (
                <div key={index} className="relative group w-[150px] h-[150px]">
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
                    onClick={(e) => handleDeleteVideo(index, e)}
                  >
                    <FaTrashAlt className="text-white" />
                  </button>
                  <button
                    className="absolute bottom-2 right-2 bg-brand p-2 rounded-full hover:opacity-80"
                    onClick={(e) => openModal(video.url, "video")}
                  >
                    <FaExpandAlt className="text-white" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {/* Modal to show full images/videos */}
      {isModalOpen && (
        <div
          className="fixed w-full top-0 left-0 min-h-screen bg-black/95 z-50 flex flex-col justify-center items-center"
          onClick={closeModal}
        >
          <div className="flex flex-col gap-2 max-w-[1000px] w-full p-4">
            <div className="flex justify-end">
              <button onClick={closeModal}>
                <FaTimes className="text-lg text-white cursor-pointer" />
              </button>
            </div>
            {modalMediaType === "image" && (
              <Image
                src={modalMedia.file ? modalMedia.url : modalMedia}
                alt="Full view"
                width={800}
                height={800}
                className="object-contain"
              />
            )}
            {modalMediaType === "video" && (
              <video
                autoPlay
                muted
                loop
                controls
                className="object-contain"
                src={modalMedia}
                width="800"
                height="800"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
