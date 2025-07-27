// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 shadow-md sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="Allahabadia Food Corner Logo" className="h-12 w-auto" />
                </Link>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <Link to="/" className="hover:text-green-500">Home</Link>
                    <Link to="/about" className="hover:text-green-500">About</Link>
                    <Link to="/contact" className="hover:text-green-500">Contact</Link>
                </div>
                
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* THIS IS THE FIX: The entire div is now conditional */}
                            {user.role === 'admin' && (
                                <div className="bg-green-600 text-white dark:text-black dark:bg-green-400 hover:bg-green-500 hover:dark:bg-green-600 px-2 py-1 rounded-lg transform transition-transform duration-300 hover:scale-105">
                                    <Link to="/admin" className="text-sm font-semibold">Admin Panel</Link>
                                </div>
                            )}

                            <Link to="/wishlist" className="text-green-400 hover:text-green-600 ring ring-green-400 hover:ring-green-600 px-2 py-1 rounded-lg">Wishlist</Link>
                            <span className="text-gray-700 dark:text-gray-300">Hi, <span className="text-green-400 font-bold">{user.name}</span></span>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">Login</Link>
                            <Link to="/signup" className="text-green-400 hover:text-green-600 ring ring-green-400 hover:ring-green-600 px-2 py-1 rounded-lg">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;