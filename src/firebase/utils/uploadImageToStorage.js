import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadImage = async (file, userId) => {
  if (!file) return null;
  const storageRef = ref(storage, `listings/${userId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};