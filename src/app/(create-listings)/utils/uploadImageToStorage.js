import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export const uploadListingImageToStorage = async (file, userId, listingId) => {
  if (!file) return null;
  const storageRef = ref(storage, `${userId}/listings/${listingId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};