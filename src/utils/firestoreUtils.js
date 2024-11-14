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
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
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
      return { listing: { id: listing.id, ...listing.data() } };
    } else {
      throw new Error("Listing not found");
    }
  } catch (error) {
    console.error("Error fetching listing: ", error);
    return { error: error };
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
  const storageRef = ref(
    storage,
    `${userId}/listings/${listingId}/images/${index}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadListingVideoToStorage = async (
  file,
  userId,
  listingId,
  index
) => {
  if (!file) return null;
  const storageRef = ref(
    storage,
    `${userId}/listings/${listingId}/videos/${index}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const saveListingData = async (listingData, formMode, listingId) => {
  if (formMode === "edit") {
    await updateDoc(doc(db, "listings", listingId), listingData);
    return listingId;
  } else {
    const docRef = await addDoc(collection(db, "listings"), listingData);
    return docRef.id;
  }
};

// Uploads images or videos to storage
export const uploadMediaFiles = async (mediaArray, userId, listingId, type) => {
  const urls = [];
  for (let i = 0; i < mediaArray.length; i++) {
    const media = mediaArray[i];
    if (media.file) {
      const uploadFn =
        type === "image"
          ? uploadListingImageToStorage
          : uploadListingVideoToStorage;
      const url = await uploadFn(media.file, userId, listingId, i);
      if (url) urls.push(url);
    }
  }
  return urls;
};

// Deletes media from storage
export const deleteMediaFromStorage = async (mediaUrls) => {
  const deletePromises = mediaUrls.map(async (url) => {
    const mediaRef = ref(storage, url);
    await deleteObject(mediaRef);
  });
  await Promise.all(deletePromises);
};

export const fetchPaginatedListingsByListingType = async (
  listingType,
  limitCount = 9,
  lastVisible = null
) => {
  try {
    let listingsQuery = query(
      collection(db, "listings"),
      where("listingType", "==", listingType),
      orderBy("createdAt", "desc")
      //limit(limitCount)
    );

    //if (lastVisible) {
    //  listingsQuery = query(listingsQuery, startAfter(lastVisible));
    //}

    const listingsSnapshot = await getDocs(listingsQuery);
    const fetchedListings = listingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //const lastDoc = listingsSnapshot.docs[listingsSnapshot.docs.length - 1];

    //return { listings: fetchedListings, lastVisible: lastDoc };
    return { listings: fetchedListings, lastVisible: null };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], lastVisible: null };
  }
};

export const getDocumentCount = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getCountFromServer(collectionRef);
    console.log(snapshot.data().count);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting document count:", error);
    return 0;
  }
};

// Likes
export const likeListingInFirestore = async ({ listingId, userId }) => {
  try {
    await addDoc(collection(db, "likes"), {
      listingId,
      userId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error liking listing:", error);
    throw error;
  }
};

export const unlikeListingInFirestore = async ({ listingId, userId }) => {
  try {
    const likesQuery = query(
      collection(db, "likes"),
      where("listingId", "==", listingId),
      where("userId", "==", userId)
    );
    const likeSnapshot = await getDocs(likesQuery);

    likeSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error unliking listing:", error);
    throw error;
  }
};

export const fetchLikeStatusFromFirestore = async ({ listingId, userId }) => {
  try {
    const likesQuery = query(
      collection(db, "likes"),
      where("listingId", "==", listingId),
      where("userId", "==", userId)
    );
    const likeSnapshot = await getDocs(likesQuery);
    return !likeSnapshot.empty;
  } catch (error) {
    console.error("Error fetching like status:", error);
    return false;
  }
};
