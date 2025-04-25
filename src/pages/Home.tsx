import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar'; 

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-200 text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">
          Welcome to Foodie Express! 🍔🍕🍣
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Craving something delicious? We’ve got you covered.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full shadow-lg text-lg"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
