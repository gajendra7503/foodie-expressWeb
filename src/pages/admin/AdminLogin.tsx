import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token); // backend se token aayega
        toast.success('Admin Login Successful');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      toast.error('Login failed. Please check backend connection.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-200">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-yellow-100 via-green-100 to-pink-200 p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
