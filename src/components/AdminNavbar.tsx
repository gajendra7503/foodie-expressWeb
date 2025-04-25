import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');  // Jo bhi token ya session key use kar rahe ho
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex items-center gap-6">
       <div className="space-x-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/admin/add-restaurant')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Restaurant
          </button>
          <button
            onClick={() => navigate('/admin/add-menu-item')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Menu Item
          </button>
          <button
            onClick={() => navigate('/admin/admin-orders')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Admin Orders
          </button>
        </div>

      {/* <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
      <Link to="/admin/add-restaurant" className="hover:text-gray-300">Add Restaurant</Link>
      <Link to="/admin/add-menu-item" className="hover:text-gray-300">Add Menu Item</Link>
      <Link to="/admin/admin-orders" className="hover:text-gray-300">Admin Orders</Link> */}

      <button
        onClick={handleLogout}
        className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
