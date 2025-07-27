// src/components/Navbar.jsx
import React, { useState, useContext } from 'react'; // 1. Import useState
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // 2. Add state to manage the mobile menu's visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); // Close menu on logout
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 shadow-md sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <img src={logo} alt="Allahabadia Food Corner Logo" className="h-12 w-auto" />
                </Link>

                {/* --- DESKTOP NAVIGATION (Hidden on mobile) --- */}
                <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <Link to="/" className="hover:text-green-500">Home</Link>
                    <Link to="/about" className="hover:text-green-500">About</Link>
                    <Link to="/contact" className="hover:text-green-500">Contact</Link>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold bg-green-600 text-white dark:text-black dark:bg-green-400 hover:bg-green-500 px-2 py-1 rounded-lg">Admin Panel</Link>
                            )}
                            <Link to="/wishlist" className="text-green-600 ring-1 ring-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg text-sm">Wishlist</Link>
                            <span className="text-gray-700 dark:text-gray-300">Hi, <span className="text-green-500 font-bold">{user.name}</span></span>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">Login</Link>
                            <Link to="/signup" className="text-green-600 ring-1 ring-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded-lg text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
                
                {/* --- MOBILE MENU BUTTON (Hamburger Icon) --- */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                             // Close Icon (X)
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            // Hamburger Icon (☰)
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU (Dropdown) --- */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 absolute w-full shadow-lg">
                    <div className="px-6 pt-2 pb-6 flex flex-col gap-4">
                        {/* Main Links */}
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Home</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Contact</Link>

                        <hr className="dark:border-gray-700"/>

                        {/* User/Auth Links */}
                        {user ? (
                            <>
                                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Admin Panel</Link>}
                                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Wishlist</Link>
                                <button onClick={handleLogout} className="text-left w-full py-2 text-red-500 hover:text-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;