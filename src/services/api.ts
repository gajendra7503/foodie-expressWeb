import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchRestaurants = () => api.get('/restaurants');
export const signupUser = (data: any) => api.post('/auth/signup', data);
export const loginUser = (data: any) => api.post('/auth/login', data);
export const fetchRestaurantById = (id: number) => api.get(`/restaurants/${id}`);
export const placeOrder = (data: any) => api.post('/order', data);

export default api;