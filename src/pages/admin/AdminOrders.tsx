import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/order/admin/all-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/api/order/update-status/${orderId}`, {
        status: newStatus,
      });
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 via-red-200 to-orange-300 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">All Orders 📦</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-gradient-to-br from-yellow-100 via-red-200 to-orange-300 p-4 shadow rounded">
              <h2 className="text-xl font-semibold mb-2">Order ID: #{order.orderId}</h2>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>
                Status:
                <span className="ml-2 font-bold">{order.status}</span>
              </p>
              <div className="mt-2">
                <label htmlFor="status" className="block mb-1">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="mt-3">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map((item: any, index: number) => (
                  <p key={index}>
                    {item.name} x {item.quantity} (₹{item.price})
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminOrders;
