import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRestaurant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        const data = response.data;
        setName(data.name);
        setLocation(data.location);
        setRating(data.rating);
        setCurrentImage(data.image_url);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };
    fetchRestaurant();
  }, [id]);

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
      await axios.put(`http://localhost:5000/api/restaurants/edit/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Restaurant updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update restaurant.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 via-red-200 to-orange-300 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Edit Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant Name"
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rating"
            className="border p-2 w-full"
            step="0.1"
            required
          />
          {currentImage && (
            <div>
              <p>Current Image:</p>
              <img src={currentImage} alt="Restaurant" className="w-48 mb-4" />
            </div>
          )}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full"
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" type="submit">
            Update Restaurant
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditRestaurant;
