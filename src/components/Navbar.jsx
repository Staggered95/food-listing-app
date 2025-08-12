// src/components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > 200) { // Only hide after scrolling down a bit
                    if (window.scrollY > lastScrollY) { // Scrolling Down
                        setIsVisible(false);
                    } else { // Scrolling Up
                        setIsVisible(true);
                    }
                } else {
                    setIsVisible(true); // Always show at the top
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        // Cleanup function to remove the listener
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); 
        navigate('/login');
    };

    return (
        <nav className={`bg-[#6B3B1B]/60 dark:bg-[#2B1A10]/70 shadow-md sticky top-0 z-50 backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <img src={logo} alt="Allahabadia Food Court Logo" className="h-12 w-24" />
                </Link>

                {/* --- DESKTOP NAVIGATION (Hidden on mobile) --- */}
                <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4A2A14] dark:text-[#F4E1C1]">
                    <Link to="/" className="hover:text-[#E0A050]">Home</Link>
                    <Link to="/about" className="hover:text-[#E0A050]">About</Link>
                    <Link to="/contact" className="hover:text-[#E0A050]">Contact</Link>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold bg-[#4A2A14] text-[#C27B37] dark:text-[#C27B37] dark:bg-[#F4E1C1] hover:bg-black hover:dark:bg-[#B89372] hover:dark:text-[#F4E1C1] px-2 py-1 rounded-lg">Admin Panel</Link>
                            )}
                            <Link to="/wishlist" className="text-[#6B3B1B] ring-1 ring-[#6B3B1B] hover:bg-[#6B3B1B] hover:text-[#C27B37] hover:ring-[#C27B37] dark:text-[#F4E1C1] dark:ring-[#F4E1C1]/50 px-2 py-1 rounded-lg text-sm">Wishlist</Link>
                            <span className="text-[#4A2A14] dark:text-[#F4E1C1]">Hi, <span className="text-xl text-[#E0A050] dark:text-[#E0A050] font-bold">{user.name}</span></span>
                            <button onClick={handleLogout} className="bg-red-500 text-black dark:text-white px-3 py-1 rounded text-sm hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-[#4A2A14] text-[#C27B37] dark:text-[#C27B37] dark:bg-[#F4E1C1] hover:bg-black hover:dark:bg-[#F4E1C1]/20 px-2 py-1 rounded-lg text-sm font-semibold">Login</Link>
                            <Link to="/signup" className="text-[#6B3B1B] ring-1 ring-[#6B3B1B] hover:bg-[#6B3B1B] hover:text-[#C27B37] hover:ring-[#C27B37] px-2 py-1 rounded-lg text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
                
                {/* --- MOBILE MENU BUTTON (Hamburger Icon) --- */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                             // Close Icon (X)
                            <svg className="w-6 h-6 text-[#4A2A14] dark:text-[#F4E1C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            // Hamburger Icon (☰)
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU (Dropdown) --- */}
            {isMenuOpen && (
                <div className={`md:hidden bg-[#F4E1C1] dark:bg-[#2B1A10] absolute w-full shadow-lg transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>                    
                <div className="px-6 pt-2 pb-6 flex flex-col gap-4">
                        {/* Main Links */}
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#4A2A14] dark:text-[#F4E1C1]">Home</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#4A2A14] dark:text-[#F4E1C1]">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#4A2A14] dark:text-[#F4E1C1]">Contact</Link>

                        <hr className="dark:border-gray-700"/>

                        {/* User/Auth Links */}
                        {user ? (
                            <>
                                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-800 dark:text-gray-200 hover:text-green-500">Wishlist</Link>
                                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#C27B37] dark:text-[#C27B37]">Admin Panel</Link>}
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