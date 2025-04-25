import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import UserNavbar from '../components/UserNavbar';
import { addToCart } from '../utils/cartUtils';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  rating: number;
  image_url: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurants/${id}/menu`);
        setMenuItems(res.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchRestaurant();
    fetchMenuItems();
    fetchReviews();
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, restaurant?.id || 0, restaurant?.name || '');
    navigate('/cart');
  };

  const handleReviewSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return toast.error('Please login to submit a review');
  
    try {
      await axios.post('http://localhost:5000/api/reviews/add', {
        userId: user.id,   // make sure yaha bhi userId use karein
        restaurantId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted successfully!');  // ✅ Yaha toast use kar liya
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };
  

  return (
    <>
      <UserNavbar />
      <div className="p-8 bg-gradient-to-br from-yellow-100 to-red-100 min-h-screen">
        {restaurant && (
          <>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{restaurant.name}</h1>
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full max-h-96 object-cover rounded-xl mb-6"
            />
            <p className="text-gray-600 mb-2">Location: {restaurant.location}</p>
            <p className="text-yellow-500 font-semibold mb-6">⭐ Rating: {restaurant.rating}</p>

            <h2 className="text-3xl font-bold mb-4 text-gray-700">Menu Items 🍔🍕</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white shadow-md rounded-lg p-4 text-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.name}</h3>
                  <p className="text-green-600 font-bold mb-2">₹{item.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Review Form Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Leave a Review 📝</h2>
              <textarea
                placeholder="Write your review..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 border rounded mb-4"
              />
              <div className="mb-4">
                <label className="font-semibold mr-2">Rating:</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="p-2 border rounded"
                >
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>{r} ⭐</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              >
                Submit Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">User Reviews 💬</h2>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded shadow mb-4">
                    <p className="font-bold">
                    {review.username} — <span className="text-yellow-500">⭐ {review.rating}</span>
                    </p>
                    <p>{review.comment}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
);
};

export default RestaurantDetail;
