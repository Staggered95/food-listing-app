// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4E1C1] dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-center text-[#6B3B1B] dark:text-white">Forgot Password</h1>
            <p className="text-sm text-center text-[#8B6A50] dark:text-gray-400">Enter your email and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 mt-1 border rounded-md border-[#E0A050]/50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]" 
                    required 
                />
                {message && <p className="text-sm text-green-600 mt-4 text-center">{message}</p>}
                {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
                <button 
                    type="submit" 
                    className="w-full mt-4 px-4 py-2 font-semibold text-white bg-[#6B3B1B] rounded-md hover:bg-[#4A2A14]"
                >
                    Send Reset Link
                </button>
            </form>
             <p className="text-sm text-center text-[#8B6A50] dark:text-gray-400 mt-4">
                Remembered your password? <Link to="/login" className="font-medium text-[#6B3B1B] hover:underline dark:text-[#E0A050]">Log in</Link>
            </p>
        </div>
    </div>
);
};

export default ForgotPasswordPage;