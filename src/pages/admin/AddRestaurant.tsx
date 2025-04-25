import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRestaurant: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('rating', rating);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/restaurants/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Restaurant added successfully!');
      navigate('/admin/dashboard'); // ✅ redirect after adding
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 via-red-200 to-orange-300 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Add New Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Restaurant
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddRestaurant;
