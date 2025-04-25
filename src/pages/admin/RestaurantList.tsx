import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  image_url: string;
  rating: number;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    // const res = await axios.get('http://localhost:5000/admin/restaurants');
    const res = await axios.get('http://localhost:5000/admin/restaurants');
    console.log(res.data);
    setRestaurants(res.data);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure to delete this restaurant?')) {
      await axios.delete(`http://localhost:5000/admin/restaurants/${id}`);
      fetchRestaurants();
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-2xl mb-4">All Restaurants</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id}>
                <td className="p-2"><img src={r.image_url} alt={r.name} width="50" /></td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.location}</td>
                <td className="p-2">{r.rating}</td>
                <td className="p-2">
                  <button
                    onClick={() => navigate(`/admin/edit-restaurant/${r.id}`)}
                    className="bg-yellow-400 px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 px-2 py-1 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantList;
