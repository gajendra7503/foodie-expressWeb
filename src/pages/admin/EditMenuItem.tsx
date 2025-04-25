import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditMenuItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<{ id: number; name: string }[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [menuItem, setMenuItem] = useState<any>(null);  // New state to hold current menu item data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu item details
        const menuItemResponse = await axios.get(`http://localhost:5000/api/menu-items/${id}`);
        const menuItemData = menuItemResponse.data;
        setMenuItem(menuItemData);
        setRestaurantId(menuItemData.restaurant_id);
        setName(menuItemData.name);
        setPrice(menuItemData.price);
        setDescription(menuItemData.description);

        // Fetch restaurants for dropdown
        const restaurantResponse = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(restaurantResponse.data);
      } catch (err) {
        console.error('Error fetching menu item or restaurants:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('restaurant_id', restaurantId.toString());
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/menu-items/${id}`, formData, 
      { headers: {'Content-Type': 'multipart/form-data'} 
    });
   
    toast.success('Menu item updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error updating menu item:', err);
      toast.error('Update failed.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-200 to-orange-300 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
        
        {/* Show current image preview */}
        {menuItem?.image_url && (
          <div className="mb-4">
            <p className="mb-1 font-semibold">Current Image:</p>
            <img src={menuItem.image_url} alt="Current" className="h-32 object-cover rounded" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(Number(e.target.value))}
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
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
            Update Menu Item
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditMenuItem;
