'use client'; // Ensure this is a client component
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { getDoc, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link'; 
import { FiEdit } from 'react-icons/fi';
import {LoadingSpinner} from '../../components/LoadingSpinner';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [listings, setListings] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username);
                    setEmail(currentUser.email);
                    setProfilePicUrl(userData.profilePicUrl || '');
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    // Fetch user's listings and transaction history
    useEffect(() => {
        const fetchUserListings = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const listingsQuery = query(collection(db, 'listings'), where('userId', '==', currentUser.uid));
                const listingsSnapshot = await getDocs(listingsQuery);
                setListings(listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
                const transactionsSnapshot = await getDocs(transactionsQuery);
                setTransactionHistory(transactionsSnapshot.docs.map(doc => doc.data()));
            }
        };

        fetchUserListings();
    }, []);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleProfileUpdate = async () => {
        const currentUser = auth.currentUser;
        const userRef = doc(db, 'users', currentUser.uid);

        // If a profile picture is uploaded, store it in Firebase Storage
        if (profilePic) {
            const profilePicRef = ref(storage, `profile_pics/${currentUser.uid}`);
            await uploadBytes(profilePicRef, profilePic);
            const profilePicUrl = await getDownloadURL(profilePicRef);
            setProfilePicUrl(profilePicUrl);

            await updateDoc(userRef, {
                profilePicUrl,
                username,
                email
            });
        } else {
            await updateDoc(userRef, { username, email });
        }

        setEditing(false);
    };

    if (loading) {
        return <p></p>; // TODO: Use LoadingSpinner here
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={profilePicUrl || 'default-profile.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    {editing && (
                        <input
                            type="file"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                            className="absolute bottom-0 left-0"
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{username}</h2>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
                {!editing && (
                    <button onClick={handleEditToggle} className="ml-auto p-2">
                        <FiEdit className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Edit Profile Section */}
            {editing && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button onClick={handleProfileUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="mt-8">
                
                {/* My Listings */}
                <div id="listings" className="mt-4">
                    <h3 className="text-xl font-bold">My Listings</h3>
                    <ul>
                        {listings.map((listing) => (
                            <li key={listing.id} className="border p-4 mt-2">
                                <h4>{listing.title}</h4>
                                <p>{listing.description}</p>
                                <button className="text-red-500">Delete</button>
                                <button className="text-blue-500 ml-4">Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Transaction History */}
                <div id="transactions" className="mt-8">
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <table className="w-full mt-4">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Item</th>
                                <th className="text-left p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionHistory.map((transaction, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="p-2">{transaction.date}</td>
                                    <td className="p-2">{transaction.item}</td>
                                    <td className="p-2">${transaction.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8">
                <Link href="/dashboard" className="text-blue-500">Back to Dashboard</Link>
                <Link href="/create-listing" className="ml-4 text-blue-500">Create New Listing</Link>
            </div>
        </div>
    );
}

export default Profile;
