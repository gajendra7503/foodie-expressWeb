import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMenuItem: React.FC = () => {
  const [restaurants, setRestaurants] = useState<{ id: number; name: string }[]>([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('restaurant_id', restaurantId);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/admin/menu-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Menu item added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setImage(null);
      setRestaurantId('');
    } catch (err) {
      console.error('Error adding menu item:', err);
      toast.error('Failed to add menu item.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 via-red-200 to-orange-300 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((rest) => (
              <option key={rest.id} value={rest.id}>
                {rest.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
