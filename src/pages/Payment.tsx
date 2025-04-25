import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment: React.FC = () => {
  const navigate = useNavigate();

  const handlePayment = (method: string) => {
    toast.success(`Payment successful with ${method}!`);
    navigate('/order-confirmation');
  };

  return (
    <>
      <UserNavbar />
      <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">💳 Payment</h1>
        <p className="text-xl text-gray-600 mb-6 text-center">Select a payment method to complete your order.</p>
        <div className="space-y-4 w-full max-w-md">
          <button
            onClick={() => handlePayment('Card')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 w-full rounded-lg text-lg transition-transform hover:scale-105"
          >
            Pay with Card
          </button>
          <button
            onClick={() => handlePayment('UPI')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 w-full rounded-lg text-lg transition-transform hover:scale-105"
          >
            Pay with UPI
          </button>
          <button
            onClick={() => handlePayment('Cash on Delivery')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 w-full rounded-lg text-lg transition-transform hover:scale-105"
          >
            Cash on Delivery
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Payment;
