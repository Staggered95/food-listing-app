// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard'; // We'll reuse our FoodCard component

const WishlistPage = ({ wishlist, toggleWishlist }) => {
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistedItems = async () => {
      setLoading(true);
      try {
        const { data: allFoods } = await axios.get('/api/foods');
        const filteredItems = allFoods.filter(item => wishlist.includes(item.id));
        setWishlistedItems(filteredItems);
      } catch (error) {
        console.error("Failed to fetch wishlist details", error);
      } finally {
        setLoading(false);
      }
    };

    if (wishlist && wishlist.length > 0) {
      fetchWishlistedItems();
    } else {
      setWishlistedItems([]);
      setLoading(false);
    }
  }, [wishlist]); 

  if (loading) {
    return <div className="text-center py-20">Loading Wishlist...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#4A2A14] dark:text-white mb-8">My Wishlist ❤️</h1>
      
      {wishlistedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistedItems.map(item => (
            <FoodCard key={item.id} item={item} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-[#8B6A50] dark:text-gray-400">Your wishlist is empty.</p>
          <p className="mt-2 text-[#8B6A50] dark:text-gray-400">Click the heart icon on any food item to add it here.</p>
          <Link to="/" className="mt-6 inline-block bg-[#6B3B1B] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#4A2A14] transition-colors">
            Find Something Delicious
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;