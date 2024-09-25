'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ProfileHeader from './utils/ProfileHeader';
import UserListings from './utils/UserListings';
import TransactionHistory from './utils/TransactionHistory';
import ProfileNavigation from './utils/ProfileNavigation';
import CreateListingModal from './utils/CreateListingModal';
import LoadingSpinner from '@/components/LoadingSpinner';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ id: currentUser.uid, ...userDoc.data() });
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleProfileUpdate = (updatedData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <div>Error: Unable to load user data. Please try again.</div>;
    }

    return (
        <ProtectedRoute>
            <div className="p-6 max-w-4xl mx-auto">
                <ProfileHeader user={user} onUpdate={handleProfileUpdate} />
                <UserListings userId={user.id} />
                <TransactionHistory userId={user.id} />
                <ProfileNavigation onCreateListing={() => setIsModalOpen(true)} />
                <CreateListingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </ProtectedRoute>
    );
}

export default Profile;