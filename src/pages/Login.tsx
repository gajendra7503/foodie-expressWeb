import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Store token in localStorage
      localStorage.setItem('token', res.data.token);

      // Decode JWT token to get user ID
      const decodedToken: any = JSON.parse(atob(res.data.token.split('.')[1]));
      const userId = decodedToken.id;

      // Fetch user details and store in localStorage
      const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
      localStorage.setItem('user', JSON.stringify(userRes.data));

      // Show success toast
      toast.success('Login Successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);  // Delay navigation to let toast message show
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-200 to-blue-200 px-4">
      <h2 className="text-3xl font-bold mb-4">Login to Foodie Express</h2>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-gray-700">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
      
      {/* ✅ ToastContainer added here */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
