import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<{
    id: number; // ✅ id add kiya hai
    name: string;
    email: string;
    phone: string;
    address: string;
    profilePic?: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    const formData = new FormData();
    formData.append('profilePic', selectedFile);
    formData.append('userId', user.id.toString()); // ✅ Ab id jaa raha hai

    try {
      const res = await axios.post('http://localhost:5000/api/auth/upload-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = { ...user, profilePic: res.data.imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setSelectedFile(null);
      toast.success('Profile photo updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload photo.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <p className="text-gray-600">No user details found. Please log in.</p>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-br from-yellow-100 via-red-100 to-pink-200 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <img
          src={user.profilePic || 'https://www.w3schools.com/howto/img_avatar.png'}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mb-4"
        />

        <p className="text-gray-700 mb-2"><strong>Name:</strong> {user.name}</p>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-700 mb-2"><strong>Phone:</strong> {user.phone}</p>
        <p className="text-gray-700 mb-4"><strong>Address:</strong> {user.address}</p>

        {user.profilePic && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2"
          >
            Update Photo
          </button>
        )}

        {(!user.profilePic || isEditing) && (
          <>
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              onClick={handleUpload}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              {user.profilePic ? 'Save Photo' : 'Upload Profile Photo'}
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
