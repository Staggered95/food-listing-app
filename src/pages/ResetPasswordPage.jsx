// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
            setMessage(data.message + ' Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4E1C1] dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-center text-[#6B3B1B] dark:text-white">Reset Your Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="New Password" 
                    className="w-full px-3 py-2 border rounded-md border-[#E0A050]/50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]" 
                    required 
                />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm New Password" 
                    className="w-full px-3 py-2 border rounded-md border-[#E0A050]/50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]" 
                    required 
                />
                {message && <p className="text-sm text-green-500 text-center">{message}</p>}
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button 
                    type="submit" 
                    className="w-full px-4 py-2 font-semibold text-white bg-[#6B3B1B] rounded-md hover:bg-[#4A2A14]"
                >
                    Reset Password
                </button>
            </form>
        </div>
    </div>
);
};

export default ResetPasswordPage;