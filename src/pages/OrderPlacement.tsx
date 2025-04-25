import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPlacement: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!fullName || !address || !contact) {
      toast.error('Please fill all fields');
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    try {
      const response = await fetch('http://localhost:5000/api/order/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          address,
          contact,
        }),
      });
  
      if (response.ok) {
        toast.success('Order placed successfully!');
  
        // Optional: clear cart items from localStorage (frontend side)
        localStorage.removeItem('cartItems');
  
        navigate('/payment');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error occurred while placing order');
    }
  };
  

  return (
    <>
      <UserNavbar />
      <div className="p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Place Your Order 🛵</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border p-3 rounded w-full"
            />
            <input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-3 rounded w-full"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border p-3 rounded w-full"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded w-full text-lg"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default OrderPlacement;
