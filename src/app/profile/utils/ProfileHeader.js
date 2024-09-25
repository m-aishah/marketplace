import { useState } from 'react';
import { FiEdit, FiCheck } from 'react-icons/fi';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';

export default function ProfileHeader({ user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [profilePic, setProfilePic] = useState(null);

    const handleSave = async () => {
        const userRef = doc(db, 'users', user.id);
        let updateData = { username };

        if (profilePic) {
            const profilePicRef = ref(storage, `${user.id}/profile_pic`);
            await uploadBytes(profilePicRef, profilePic);
            const profilePicUrl = await getDownloadURL(profilePicRef);
            updateData.profilePicUrl = profilePicUrl;
        }

        await updateDoc(userRef, updateData);
        onUpdate(updateData);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
                <img
                    src={user.profilePicUrl || '/default-profile.png'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                        />
                        <FiEdit className="w-5 h-5" />
                    </label>
                )}
            </div>
            <div>
                {isEditing ? (
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                ) : (
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                )}
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                className="ml-auto p-2"
            >
                {isEditing ? (
                    <FiCheck className="w-6 h-6 text-green-500" />
                ) : (
                    <FiEdit className="w-6 h-6" />
                )}
            </button>
        </div>
    );
}