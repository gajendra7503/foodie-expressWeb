import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../components/UserNavbar';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user && user.id) {
      fetchOrders(user.id);
    }
  }, []);

  const fetchOrders = async (userId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/order/order-history/${userId}`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">📜 Your Order History</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-xl">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">
                  Order ID: #{order.orderId} | Status: {order.status}
                </h2>
                <p className="mb-2">Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="font-bold mb-2">Total Amount: ₹{order.totalAmount}</p>
                <ul className="list-disc pl-5">
                  {order.items.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} - Qty: {item.quantity} × ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
