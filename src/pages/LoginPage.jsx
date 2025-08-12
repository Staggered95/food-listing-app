// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login(data.token);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Send the token from Google to backend
            const { data } = await axios.post('/api/auth/google', {
                credential: credentialResponse.credential,
            });
            login(data.token); 
            navigate('/');
        } catch (error) {
            setError('Google Sign-In failed. Please try again.');
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4E1C1] dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-[#F4E1C1]/10 backdrop-blur-sm rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-[#6B3B1B] dark:text-white">Login to AFC</h1>
            <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setError('Google Sign-In failed. Please try again.');
                        }}
                    />
                </div>
                
                <div className="flex items-center justify-center my-4">
                    <hr className="w-full border-gray-300 dark:border-gray-600"/>
                    <span className="px-2 text-sm text-[#8B6A50] dark:text-gray-400">OR</span>
                    <hr className="w-full border-gray-300 dark:border-gray-600"/>
                </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-[#4A2A14] dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-[#E0A050]/50 dark:bg-[#F4E1C1]/20 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4A2A14] dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-[#E0A050]/50 dark:bg-[#F4E1C1]/20 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]"
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <div className="text-right text-sm -mt-2">
                    <Link to="/forgot-password" className="font-medium text-[#6B3B1B] hover:underline dark:text-[#E0A050]">Forgot Password?</Link>
                </div>
                <div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-[#6B3B1B] rounded-md hover:bg-[#4A2A14] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B3B1B]">
                        Login
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-[#8B6A50] dark:text-gray-400">
                Don't have an account? <Link to="/signup" className="font-medium text-[#6B3B1B] hover:underline dark:text-[#E0A050]">Sign up</Link>
            </p>
        </div>
    </div>
);
};

export default LoginPage;