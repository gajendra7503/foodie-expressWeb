import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../components/UserNavbar';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // User object ko localStorage se nikal lo
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      fetchCartItems(user.id);
    } else {
      console.error('User not found in localStorage');
    }
  }, []);

  const fetchCartItems = async (userId: number) => {
    console.log('Fetching cart items for userId:', userId);  // add this
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/user-cart/${userId}`);
      setCartItems(res.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const increaseQuantity = (cart_id: number) => {
    const updatedCart = cartItems.map((item) =>
      item.cart_id === cart_id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    // Optionally API call bhi kar sakte ho yahan to update quantity in DB
  };

  const decreaseQuantity = (cart_id: number) => {
    const updatedCart = cartItems
      .map((item) =>
        item.cart_id === cart_id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <>
      <UserNavbar />
      <div className="p-8 bg-gradient-to-br from-green-100 to-blue-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-xl">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.cart_id}
                  className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-green-600 font-bold">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.cart_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        -
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.cart_id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold">
                    ₹{parseFloat(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-4">Total: ₹{totalAmount}</h2>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
