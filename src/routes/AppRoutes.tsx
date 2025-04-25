import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Restaurants from '../pages/Restaurants';
import RestaurantDetail from '../pages/RestaurantDetail';
import Cart from '../pages/Cart';
import Home from '../pages/Home';
import OrderPlacement from '../pages/OrderPlacement';
import OrderConfirmation from '../pages/OrderConfirmation';
import Payment from '../pages/Payment';
import ProtectedRoute from '../components/ProtectedRoute';

// Admin
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddRestaurant from '../pages/admin/AddRestaurant';
import EditRestaurant from '../pages/admin/EditRestaurant';
import AddMenuItem from '../pages/admin/AddMenuItem';
import EditMenuItem from '../pages/admin/EditMenuItem';
import RestaurantList from '../pages/admin/RestaurantList';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import Profile from '../pages/Profile';
import OrderHistory from '../pages/OrderHistory';
import AdminOrders from '../pages/admin/AdminOrders';
import SignIn from '../pages/SignIn';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Auth Routes */}
      {/* <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} /> */}
      <Route path="/sign" element={<SignIn isOpen={true} onClose={() => {}} />} />

      {/* User Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <Restaurants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <ProtectedRoute>
            <RestaurantDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <OrderPlacement />
    </ProtectedRoute>
  }>
</Route>
<Route
  path="/order-confirmation"
  element={
    <ProtectedRoute>
      <OrderConfirmation />
    </ProtectedRoute>
  }
/>
<Route
  path="/payment"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>
<Route
  path="/order-history"
  element={
    <ProtectedRoute>
      <OrderHistory />
    </ProtectedRoute>
  }
/>

   {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/restaurants"
        element={
          <AdminProtectedRoute>
            <RestaurantList />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/add-restaurant"
        element={
          <AdminProtectedRoute>
            <AddRestaurant />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-restaurant/:id"
        element={
          <AdminProtectedRoute>
            <EditRestaurant />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/add-menu-item"
        element={
          <AdminProtectedRoute>
            <AddMenuItem />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-menu-item/:id"
        element={
          <AdminProtectedRoute>
            <EditMenuItem />
          </AdminProtectedRoute>
        }
      />
       <Route
        path="/admin/admin-orders"
        element={
          <AdminProtectedRoute>
            <AdminOrders  />
          </AdminProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<h2>404 - Page not found</h2>} />
    </Routes>
  );
};

export default AppRoutes;
