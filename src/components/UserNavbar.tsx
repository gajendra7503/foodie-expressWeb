// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const UserNavbar: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/sign');
//   };

//   return (
//     <nav className="bg-blue-700 p-4 text-white flex gap-6 items-center justify-between">
//       {/* <div className="flex gap-6">
//       <Link to="/Profile" className="hover:text-gray-300">Profile</Link>
//         <Link to="/" className="hover:text-gray-300">Home</Link>
//         <Link to="/restaurants" className="hover:text-gray-300">Restaurants</Link>
//         <Link to="/cart" className="hover:text-gray-300">Cart</Link>
//         <Link to="/order-history" className="hover:text-gray-300">Order History</Link>
//       </div> */}
//       <div className="space-x-4 mb-6">
//           <button
//             onClick={() => navigate('/Profile')}
//             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded"
//           >
//             Profile
//           </button>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => navigate('/restaurants')}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
//           >
//            Restaurants
//           </button>
//           <button
//             onClick={() => navigate('/cart')}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
//           >
//            Cart
//           </button>
//           <button
//             onClick={() => navigate('/order-history')}
//             className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
//           >
//           Order History
//           </button>
//         </div>
//       <button
//         onClick={handleLogout}
//         className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// };

// export default UserNavbar;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react for icons

const UserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/sign');
  };

  return (
    <nav className="bg-blue-700 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Foodie-Express</div>

        {/* Hamburger for small screens */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Full nav for medium+ screens */}
        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={() => navigate('/Profile')}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Restaurants
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Cart
          </button>
          <button
            onClick={() => navigate('/order-history')}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Order History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="flex flex-col mt-4 gap-3 md:hidden">
          <button
            onClick={() => navigate('/Profile')}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Restaurants
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Cart
          </button>
          <button
            onClick={() => navigate('/order-history')}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Order History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
