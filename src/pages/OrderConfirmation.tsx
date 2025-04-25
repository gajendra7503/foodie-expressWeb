import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
        <h1 className="text-5xl font-bold mb-4 text-green-700">✅ Order Confirmed! 🎉</h1>
        <p className="text-xl text-gray-700 mb-6 text-center">
          Thank you for ordering from <span className="font-semibold">Foodie Express</span>.  
          Your delicious food is on its way! 🚀
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Explore More Restaurants
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
