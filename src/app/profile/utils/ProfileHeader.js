import React, { useState, useRef } from "react";
import { FiEdit2, FiCheck, FiX, FiTrash2, FiUser } from "react-icons/fi";
import { updateDoc, doc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";

export default function ProfileHeader({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const userRef = doc(db, "users", user.id);
    let updateData = { username, bio };

    if (profilePic) {
      const profilePicRef = ref(storage, `${user.id}/profile_pic`);
      await uploadBytes(profilePicRef, profilePic);
      const profilePicUrl = await getDownloadURL(profilePicRef);
      updateData.profilePicUrl = profilePicUrl;
    }

    await updateDoc(userRef, updateData);
    onUpdate(updateData);
    setIsEditing(false);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(user.username);
    setBio(user.bio || "");
    setProfilePic(null);
    setPreviewUrl(null);
  };

  const handleDeleteProfilePic = async () => {
    if (user.profilePicUrl) {
      const profilePicRef = ref(storage, `${user.id}/profile_pic`);
      await deleteObject(profilePicRef);
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { profilePicUrl: null });
      onUpdate({ profilePicUrl: null });
    }
    setProfilePic(null);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <img
            src={previewUrl || user.profilePicUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          {isEditing && (
            <div className="absolute -bottom-2 -right-2 flex space-x-1">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-brand text-white p-1 rounded-full hover:bg-brand/80 transition"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              {(user.profilePicUrl || profilePic) && (
                <button
                  onClick={handleDeleteProfilePic}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-2xl font-bold mb-2 border-b border-gray-300 focus:outline-none focus:border-brand w-full"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
          )}
          <p className="text-sm text-gray-500 mb-2">{user.email}</p>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand"
              rows="3"
              placeholder="Add a bio..."
            />
          ) : (
            <p className="text-sm text-gray-700">
              {bio || "No bio added yet."}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 flex items-center"
            >
              <FiX className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80 flex items-center"
            >
              <FiCheck className="mr-2" /> Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 flex items-center"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
