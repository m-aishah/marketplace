import { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

export default function EditProfileForm({ user, onSave }) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [profilePic, setProfilePic] = useState(null);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const userRef = doc(db, 'users', user.id);

        let updateData = { username, email };

        if (profilePic) {
            const profilePicRef = ref(storage, `${user.id}/profile_pic`);
            await uploadBytes(profilePicRef, profilePic);
            const profilePicUrl = await getDownloadURL(profilePicRef);
            updateData.profilePicUrl = profilePicUrl;
        }

        await updateDoc(userRef, updateData);
        onSave();
    };

    return (
        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Changes
            </button>
        </form>
    );
}