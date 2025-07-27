// src/pages/FoodDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const FoodDetailPage = ({ wishlist, toggleWishlist }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHindi, setShowHindi] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        setLoading(true);
        // The food item data is now fetched from your API
        // NOTE: We assume that your public food data does not require authentication to view
        const { data } = await axios.get(`/api/foods/${id}`);
        setItem(data);
        setShowHindi(false);
      } catch (error) {
        console.error("Failed to fetch food item", error);
        setItem(null); // Set item to null if not found or on error
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]); // Re-run the effect if the ID in the URL changes

  if (loading) {
    return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <h2 className="text-2xl">Food item not found.</h2>
        <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const isWishlisted = user && wishlist.includes(item.id);

  return (
    <>
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img className="h-64 w-full object-cover md:h-full" src={item.imageUrl} alt={item.name} />
          </div>
          <div className="flex items-center mt-6">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{parseFloat(item.price).toFixed(2)}</span>
            </div>
          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-start">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.type}
              </span>
              {user && ( // Only show wishlist icon if user is logged in
                <button onClick={() => toggleWishlist(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className={`w-7 h-7 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
                  </svg>
                </button>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">{item.name}</h2>
            <div className="text-right mb-2">
                <button 
                  onClick={() => setShowHindi(!showHindi)}
                  className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline"
                >
                  {showHindi ? 'Show in English' : 'हिंदी में देखें'}
                </button>
              </div>
              <div className="font-poppins prose prose-sm dark:prose-invert mt-2 text-gray-600 text-md dark:text-gray-300">
              {showHindi ? (
                <ReactMarkdown>{item.description_hindi}</ReactMarkdown>
              ) : (
                <ReactMarkdown>{item.description}</ReactMarkdown>
              )}
            </div>
            
          </div>
        </div>

      {/* --- NEW: Sub-Images Gallery --- */}
      {item.subImages && item.subImages.length > 0 && (
                    <div className="p-8 border-t dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {item.subImages.map(subImg => (
                                <div key={subImg.id}>
                                    <img 
                      src={subImg.image_url} 
                      alt={`${item.name} gallery image`} 
                      className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => setSelectedImage(subImg.image_url)}
                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

      </div>
    </div>

{selectedImage && (
  <div 
    className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75"
    onClick={() => setSelectedImage(null)} // Click outside to close
  >
    <div 
      className="relative p-4"
      // Stop click from bubbling up and closing the modal when image is clicked
      onClick={(e) => e.stopPropagation()} 
    >
      <img 
        src={selectedImage} 
        alt="Full screen view" 
        className="max-w-3xl max-h-[70vh] object-contain"
      />
      {/* Optional: Add a close button */}
      <button 
        className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl"
        onClick={() => setSelectedImage(null)}
      >
        &times;
      </button>
    </div>
  </div>
)}
</>

  );
};

export default FoodDetailPage;