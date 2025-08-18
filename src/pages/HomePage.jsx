// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react'; // 1. Import useRef
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';


// It defines the order and names of your categories to be displayed.
const displayCategories = [
    "Chef's Specials",
    "Chaat & Starters",
    "Vegetarian Mains",
    "Non-Vegetarian Mains",
    "Biryani & Rice",
    "Desserts",
    "Beverages",
    "Nature's Basket"
];

// --- 2. Decide how many categories to show by default ---
const VISIBLE_CATEGORY_COUNT = 4;
const visibleCategories = displayCategories.slice(0, VISIBLE_CATEGORY_COUNT);
const hiddenCategories = displayCategories.slice(VISIBLE_CATEGORY_COUNT);

const HomePage = ({ wishlist, toggleWishlist }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [groupedItems, setGroupedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [foodType, setFoodType] = useState('all');
    const [activeCategory, setActiveCategory] = useState("Chef's Specials");
    const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // const handleCategoryClick = (category) => {
    //     setActiveCategory(category);
    //     const section = document.getElementById(category);
    //     if (section) {
    //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    // };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMoreCategoriesOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setIsMoreCategoriesOpen(false); // Close dropdown on selection
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

        <div className="top-[70px] z-40 bg-[#F4E1C1]/0 dark:bg-[#2B1A10]/0 backdrop-blur-sm py-4 mb-8 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">

                <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 md:mb-0 w-full">
                        {/* Always visible categories */}
                        {visibleCategories.map(category => (
                            groupedItems[category] && (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                                        activeCategory === category
                                            ? 'bg-[#6B3B1B] text-white'
                                            : 'bg-white/50 dark:bg-gray-800/50 text-[#4A2A14] dark:text-gray-300 hover:bg-[#E0A050] hover:text-white'
                                    }`}
                                >
                                    {category}
                                </button>
                            )
                        ))}
                        
                        {/* "More" button and dropdown */}
                        {hiddenCategories.length > 0 && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsMoreCategoriesOpen(!isMoreCategoriesOpen)}
                                    className="px-4 py-2 rounded-full text-sm font-semibold bg-white/50 dark:bg-gray-800/50 text-[#4A2A14] dark:text-gray-300 hover:bg-[#E0A050] hover:text-white"
                                >
                                    More ▾
                                </button>
                                {isMoreCategoriesOpen && (
                                    <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2">
                                        {hiddenCategories.map(category => (
                                            groupedItems[category] && (
                                                <a
                                                    key={category}
                                                    href={`#${category}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCategoryClick(category);
                                                    }}
                                                    className={`block px-4 py-2 text-sm text-left ${activeCategory === category ? 'font-bold text-[#6B3B1B]' : 'text-[#4A2A14]'} dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                                                >
                                                    {category}
                                                </a>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                <div className="flex space-x-4 flex-shrink-0">
                    <button onClick={() => setFoodType('all')} className={foodType === 'all' ? 'font-bold text-[#C27B37]' : 'text-[#8B6A50] hover:text-[#C27B37]'}>All</button>
                    <button onClick={() => setFoodType('veg')} className={foodType === 'veg' ? 'font-bold text-[#C27B37]' : 'text-[#8B6A50] hover:text-[#C27B37]'}>Veg</button>
                    <button onClick={() => setFoodType('non-veg')} className={foodType === 'non-veg' ? 'font-bold text-[#C27B37]' : 'text-[#8B6A50] hover:text-[#C27B37]'}>Non-Veg</button>
                </div>
            </div>
        </div>

        <div className="space-y-12">
            {displayCategories.map(category => (
                groupedItems[category] && groupedItems[category].length > 0 && (
                    <section key={category} id={category}>
                        {/* --- MODIFIED: Section Heading with New Palette --- */}
                        <h2 className="text-2xl font-bold text-[#4A2A14] dark:text-white mb-6 border-l-4 border-[#6B3B1B] pl-4">
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
                <p className="text-xl text-[#8B6A50] dark:text-gray-400">No items match your search. 😕</p>
            </div>
        )}
    </main>
);
};

export default HomePage;