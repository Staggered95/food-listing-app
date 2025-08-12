// src/components/FoodCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 
import { useContext } from 'react';

const FoodCard = ({ item, wishlist, toggleWishlist }) => {
  const { user } = useContext(AuthContext);
  const isWishlisted = user && wishlist.includes(item.id);
  console.log('Data received by FoodCard:', item);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      toggleWishlist(item.id);
    } else {
      alert('Please log in to add items to your wishlist.');
    }
  };

  return (
    <Link to={`/food/${item.id}`} className="block group">
      <div className="bg-white hover:bg-[#F4E1C1]/20 dark:bg-[#F4E1C1]/20 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#E0A050]/30 group-hover:-translate-y-1">
        <div className="relative">
          <img src={item.imageUrl} alt={item.name} className="w-full h-52 object-cover" />
          {user && (
            <button onClick={handleWishlistClick} className="absolute top-2 right-2 bg-white/70 dark:bg-gray-800/70 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors">
              <svg className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'group-hover:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-[#4A2A14] dark:text-white">{item.name}</h3>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-bold text-[#6B3B1B] dark:text-[#E0A050]">₹{parseFloat(item.price).toFixed(2)}</span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {item.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;