// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';

// --- THIS ARRAY WAS MISSING ---
// It defines the order and names of your categories to be displayed.
const displayCategories = [
    "Chef's Specials",
    "Chaat & Starters",
    "From the Tandoor",
    "Vegetarian Mains",
    "Non-Vegetarian Mains",
    "Biryani & Rice",
    "Breads & Sides",
    "Desserts",
    "Beverages"
];

const HomePage = ({ wishlist, toggleWishlist }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [groupedItems, setGroupedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [foodType, setFoodType] = useState('all');
    const [activeCategory, setActiveCategory] = useState("Chef's Specials");

    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/foods');
                setFoodItems(data);
            } catch (error) {
                console.error('Failed to fetch food items', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    useEffect(() => {
        let filtered = [...foodItems];

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (foodType !== 'all') {
            filtered = filtered.filter(item => item.type === foodType);
        }

        const grouped = filtered.reduce((acc, item) => {
            const category = item.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
        setGroupedItems(grouped);

    }, [searchQuery, foodType, foodItems]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        const section = document.getElementById(category);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading Menu...</div>;
    }

    return (
        <main className="container mx-auto px-6 py-8">
            <div className="mb-8 max-w-2xl mx-auto">
                <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="sticky top-[70px] z-40 bg-gray-50 dark:bg-gray-950 py-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 md:mb-0 w-full">
                        {displayCategories.map(category => (
                            groupedItems[category] && (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                                        activeCategory === category
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            )
                        ))}
                    </div>
                    <div className="flex space-x-4 flex-shrink-0">
                        <button onClick={() => setFoodType('all')} className={foodType === 'all' ? 'font-bold text-green-600 dark:text-green-400' : 'text-gray-500'}>All</button>
                        <button onClick={() => setFoodType('veg')} className={foodType === 'veg' ? 'font-bold text-green-600 dark:text-green-400' : 'text-gray-500'}>Veg</button>
                        <button onClick={() => setFoodType('non-veg')} className={foodType === 'non-veg' ? 'font-bold text-green-600 dark:text-green-400' : 'text-gray-500'}>Non-Veg</button>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {displayCategories.map(category => (
                    groupedItems[category] && groupedItems[category].length > 0 && (
                        <section key={category} id={category}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-green-500 pl-4">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {groupedItems[category].map(item => (
                                    <FoodCard key={item.id} item={item} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                                ))}
                            </div>
                        </section>
                    )
                ))}
            </div>

            {Object.values(groupedItems).flat().length === 0 && !loading && (
                <div className="text-center py-12 col-span-full">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No items match your search. 😕</p>
                </div>
            )}
        </main>
    );
};

export default HomePage;