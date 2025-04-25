import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  rating: number;
  image_url: string;
}

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(res.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = ratingFilter ? restaurant.rating >= ratingFilter : true;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-pink-200 to-blue-300 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Restaurants Near You 🍽️</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-3 rounded w-full md:w-1/2"
        />
        <select
          value={ratingFilter || ''}
          onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
          className="border p-3 rounded w-full md:w-1/4"
        >
          <option value="">Filter by Rating</option>
          <option value="4">4 ⭐ & above</option>
          <option value="3">3 ⭐ & above</option>
          <option value="2">2 ⭐ & above</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white shadow-md rounded-lg p-4 text-center">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{restaurant.name}</h2>
              <p className="text-gray-500 mb-1">{restaurant.location}</p>
              <p className="text-yellow-500 font-bold mb-4">⭐ {restaurant.rating}</p>
              <button
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-xl">No restaurants found 😞</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
