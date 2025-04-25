import React from 'react';

interface RestaurantProps {
  restaurant: {
    id: number;
    name: string;
    image_url: string;
    rating: number;
    location: string;
  };
  
}

const RestaurantCard: React.FC<RestaurantProps> = ({ restaurant }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition">
      <img src={`http://localhost:5000/uploads/restaurants/${restaurant.image_url}`} alt={restaurant.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{restaurant.name}</h2>
        <p className="text-gray-600">{restaurant.location}</p>
        <p className="text-yellow-500 font-semibold mt-2">⭐ {restaurant.rating}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;