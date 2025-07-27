// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// CONTEXT
import AuthContext from './context/AuthContext';

// COMPONENTS
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// PAGES
import HomePage from './pages/HomePage';
import FoodDetailPage from './pages/FoodDetailPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';

axios.defaults.baseURL = 'http://localhost:5000';

const App = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  // DEBUG LOG
  console.log('App component is rendering. User is:', user);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        try {
          const { data } = await axios.get('/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlist(data);
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (foodId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const isWishlisted = wishlist.includes(foodId);

    try {
      if (isWishlisted) {
        await axios.delete(`/api/wishlist/${foodId}`, { headers });
        setWishlist(wishlist.filter(id => id !== foodId));
      } else {
        await axios.post('/api/wishlist', { foodId }, { headers });
        setWishlist([...wishlist, foodId]);
      }
    } catch (error) {
      console.error('Error updating wishlist', error);
    }
  };

  return (
    <BrowserRouter>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/food/:id" element={<FoodDetailPage wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;