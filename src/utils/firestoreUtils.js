import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";

// Add a new listing
export const addListingToFirestore = async (listingData, imageFile) => {
  try {
    // Add listing to Firestore
    const docRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      createdAt: new Date(),
    });

    // If there's an image, upload it and update the listing
    if (imageFile) {
      const imageUrl = await uploadListingImage(
        imageFile,
        listingData.userId,
        docRef.id
      );
      await updateDoc(docRef, { imageUrl });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error adding listing: ", error);
    throw error;
  }
};

// Upload listing image
export const uploadListingImage = async (file, userId, listingId) => {
  if (!file) return null;
  const storageRef = ref(storage, `${userId}/listings/${listingId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Update an existing listing
export const updateListingInFirestore = async (
  listingId,
  updateData,
  newImageFile
) => {
  try {
    const listingRef = doc(db, "listings", listingId);

    // If there's a new image, upload it and add the URL to updateData
    if (newImageFile) {
      const listing = await getDoc(listingRef);
      const userId = listing.data().userId;
      const imageUrl = await uploadListingImage(
        newImageFile,
        userId,
        listingId
      );
      updateData.imageUrl = imageUrl;
    }

    await updateDoc(listingRef, updateData);
    return listingId;
  } catch (error) {
    console.error("Error updating listing: ", error);
    throw error;
  }
};

// Delete a listing
export const deleteListingFromFirestore = async (listingId) => {
  try {
    // Get the listing to find the image URL
    const listingRef = doc(db, "listings", listingId);
    const listing = await getDoc(listingRef);
    const imageUrl = listing.data().imageUrl;

    // Delete the listing document
    await deleteDoc(listingRef);

    // If there was an image, delete it from storage
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error("Error deleting listing: ", error);
    throw error;
  }
};

// Fetch a single listing
export const getListingFromFirestore = async (listingId) => {
  try {
    const listingRef = doc(db, "listings", listingId);
    const listing = await getDoc(listingRef);
    if (listing.exists()) {
      return { id: listing.id, ...listing.data() };
    } else {
      throw new Error("Listing not found");
    }
  } catch (error) {
    console.error("Error fetching listing: ", error);
    throw error;
  }
};

// Fetch all listings for a user
export const getUserListingsFromFirestore = async (userId) => {
  try {
    const q = query(collection(db, "listings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user listings: ", error);
    throw error;
  }
};

// Fetch all listings (TODO: you might want to add pagination here for large datasets)
export const getAllListingsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all listings: ", error);
    throw error;
  }
};

// Delete an image from storage
export const deleteImageFromStorage = async (imageUrl) => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};

export const uploadListingImageToStorage = async (
  file,
  userId,
  listingId,
  index
) => {
  if (!file) return null;
  const storageRef = ref(storage, `${userId}/listings/${listingId}/${index}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
