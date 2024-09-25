import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const addListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding listing: ", error);
    throw error;
  }
};