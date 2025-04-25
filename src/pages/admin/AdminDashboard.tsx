import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'restaurant' | 'menuItem' | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null);

  const fetchData = async () => {
    try {
      const resRestaurants = await axios.get('http://localhost:5000/api/restaurants');

      setRestaurants(resRestaurants.data);

      const resMenuItems = await axios.get('http://localhost:5000/api/menu-items');

      setMenuItems(resMenuItems.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDeleteClick = (type: 'restaurant' | 'menuItem', item: { id: number; name: string }) => {
    setDeleteType(type);
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem || !deleteType) return;

    try {
      if (deleteType === 'restaurant') {
        await axios.delete(`http://localhost:5000/api/admin/restaurants/${selectedItem.id}`);
      } else {
        await axios.delete(`http://localhost:5000/api/admin/menu-items/${selectedItem.id}`);
      }
      toast.success(`${deleteType === 'restaurant' ? 'Restaurant' : 'Menu item'} deleted successfully!`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('Deletion failed.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-8 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-200">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* <div className="space-x-4 mb-6">
          <button
            onClick={() => navigate('http://localhost:5000/api/restaurants')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded"
          >
            View All Restaurants
          </button>
          <button
            onClick={() => navigate('/admin/add-restaurant')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add Restaurant
          </button>
          <button
            onClick={() => navigate('/admin/add-menu-item')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Add Menu Item
          </button>
        </div> */}

        <h2 className="text-xl font-semibold mt-8 mb-4">Restaurants</h2>
        <table className="w-full border mb-8">
          <thead>
            <tr>
              <th className="border-2 border-gray-300 p-2">Name</th>
              <th className="border-2 border-gray-300 p-2">Location</th>
              <th className="border-2 border-gray-300 p-2">Rating</th>
              <th className="border-2 border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r: any) => (
              <tr key={r.id}>
                <td className="border-2 border-gray-300 p-2">{r.name}</td>
                <td className="border-2 border-gray-300 p-2">{r.location}</td>
                <td className="border-2 border-gray-300 p-2">{r.rating}</td>
                <td className="border-2 border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-restaurant/${r.id}`)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick('restaurant', { id: r.id, name: r.name })}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border-2 border-gray-300 p-2">Name</th>
              <th className="border-2 border-gray-300 p-2">Price</th>
              <th className="border-2 border-gray-300 p-2">Restaurant ID</th>
              <th className="border-2 border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((m: any) => (
              <tr key={m.id}>
                <td className="border-2 border-gray-300 p-2">{m.name}</td>
                <td className="border-2 border-gray-300 p-2">{m.price}</td>
                <td className="border-2 border-gray-300 p-2">{m.restaurant_id}</td>
                <td className="border-2 border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-menu-item/${m.id}`)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick('menuItem', { id: m.id, name: m.name })}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name || ''}
      />
      <ToastContainer />
    </div>
    
  );
};

export default AdminDashboard;
