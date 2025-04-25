import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validation Functions
  const isValidName = (name: string) => /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[6789]\d{9}$/.test(phone);
  const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword, address } = form;

    // Validations
    if (!isValidName(name)) return toast.error('Name must contain only alphabets with one space between words.');
    if (!isValidEmail(email)) return toast.error('Enter a valid email.');
    if (!isValidPhone(phone)) return toast.error('Phone number must start with 6,7,8, or 9 and be exactly 10 digits.');
    if (!isValidPassword(password)) return toast.error('Password must be at least 6 characters and contain letters, numbers, and special characters.');
    if (password !== confirmPassword) return toast.error('Passwords do not match.');

    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name, email, phone, password, address
      });
      toast.success('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Signup failed. Try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 to-blue-200 px-4"
    >
      <h2 className="text-3xl font-bold mb-4">Sign Up for Foodie Express</h2>
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="phone" type="text" placeholder="Phone Number" value={form.phone} maxLength={10} onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.value.replace(/\D/g, '') } })} className="w-full p-3 border rounded" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded" required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full p-3 border rounded" required />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-3 border rounded" required />
        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600">
          Sign Up
        </motion.button>
      </form>
      <p className="mt-4 text-gray-700">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
      <ToastContainer />
    </motion.div>
  );
};

export default Signup;
