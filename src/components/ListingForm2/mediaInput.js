import { useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { MediaDisplayBox } from "./mediaDisplayBox";

const MediaInput = ({
  images,
  videos,
  setImages,
  setVideos,
  setDeletedImages,
  setDeletedVideos,
  handleFileUpload,
}) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] flex flex-col px-5 pb-5 mb-10 rounded-b-lg">
      <MediaDisplayBox
        images={images}
        videos={videos}
        setImages={setImages}
        setVideos={setVideos}
        setDeletedImages={setDeletedImages}
        setDeletedVideos={setDeletedVideos}
      />
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
  );
};

export default MediaInput;
