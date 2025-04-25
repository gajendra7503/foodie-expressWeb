import axios from 'axios';

export const addToCart = async (item: any, userId: number, navigate: any) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await axios.post('http://localhost:5000/api/cart/add-to-cart', {
      user_id: user.id,
      menu_item_id: item.id,
      quantity: 1,
    });
    alert('Item added to cart!');
    navigate('/cart');
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};