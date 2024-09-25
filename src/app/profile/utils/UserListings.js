import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteListingFromFirestore } from '@/utils/firestoreUtils';
import { db } from '@/firebase';
import Link from 'next/link';

export default function UserListings({ userId }) {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsQuery = query(collection(db, 'listings'), where('userId', '==', userId));
            const listingsSnapshot = await getDocs(listingsQuery);
            setListings(listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchUserListings();
    }, [userId]);

    const handleDelete = async (listingId) => {
        try {
            // This will delete both the listing document and its associated image
            await deleteListingFromFirestore(listingId);
            
            // Update the local state to remove the deleted listing
            setListings(listings.filter(listing => listing.id !== listingId));
            
            // Optionally, show a success message to the user
            console.log("Listing successfully deleted");
        } catch (error) {
            console.error("Error deleting listing:", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">My Listings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                    <div key={listing.id} className="border p-4 rounded shadow">
                        <h4 className="font-semibold">{listing.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                        <div className="flex justify-between items-center">
                            <button 
                                onClick={() => handleDelete(listing.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                            <Link href={`/edit-listing/${listing.id}`} className="text-blue-500 hover:text-blue-700">
                                Edit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}