import React, { useState, useRef, useEffect } from "react";
import { FiEdit2, FiCheck, FiX, FiTrash2, FiUser } from "react-icons/fi";
import { updateDoc, doc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import Image from "next/image";

export default function ProfileHeader({ user, onUpdate, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [editedBio, setEditedBio] = useState(user.bio || "");
  const [editedProfilePic, setEditedProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profilePicUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(user.profilePicUrl);
  }, [user.profilePicUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!isOwnProfile) return;
    setIsSaving(true);
    const userRef = doc(db, "users", user.id);
    let updateData = { username: editedUsername, bio: editedBio };

    if (editedProfilePic) {
      const profilePicRef = ref(storage, `${user.id}/profile_pic`);
      await uploadBytes(profilePicRef, editedProfilePic);
      const profilePicUrl = await getDownloadURL(profilePicRef);
      updateData.profilePicUrl = profilePicUrl;
    } else if (previewUrl === null && user.profilePicUrl) {
      const profilePicRef = ref(storage, `${user.id}/profile_pic`);
      await deleteObject(profilePicRef);
      updateData.profilePicUrl = null;
    }

    await updateDoc(userRef, updateData);
    onUpdate({ ...user, ...updateData });
    setIsEditing(false);
    setIsSaving(false);

    setEditedUsername(updateData.username);
    setEditedBio(updateData.bio);
    setPreviewUrl(updateData.profilePicUrl);
    setEditedProfilePic(null);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedUsername(user.username);
    setEditedBio(user.bio || "");
    setPreviewUrl(user.profilePicUrl);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUsername(user.username);
    setEditedBio(user.bio || "");
    setEditedProfilePic(null);
    setPreviewUrl(user.profilePicUrl);
  };

  const handleDeleteProfilePic = () => {
    setPreviewUrl(null);
    setEditedProfilePic(null);
  };

  const displayImageUrl = isEditing ? previewUrl : user.profilePicUrl;

  return (
    <div className="bg-white shadow-lg shadow-brand/20 rounded-lg p-6 mb-6 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {isOwnProfile && isEditing && (
            <div className="absolute -bottom-2 -right-2 flex space-x-1">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-brand text-white p-1 rounded-full hover:bg-brand/80 transition"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              {displayImageUrl && (
                <button
                  onClick={handleDeleteProfilePic}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {isOwnProfile && (
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          {isOwnProfile && isEditing ? (
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="text-2xl font-bold mb-2 border-b border-gray-300 focus:outline-none focus:border-brand w-full"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
          )}
          <p className="text-sm text-gray-500 mb-2">{user.email}</p>
          {isOwnProfile && isEditing ? (
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand"
              rows="3"
              placeholder="Add a bio..."
            />
          ) : (
            <p className="text-sm text-gray-700">
              {user.bio || "No bio added yet."}
            </p>
          )}
        </div>
      </div>
      {isOwnProfile && (
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
                className={`transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80 flex items-center ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                ) : (
                  <FiCheck className="mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={handleStartEditing}
              className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 flex items-center"
            >
              <FiEdit2 className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}
