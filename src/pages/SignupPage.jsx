// src/pages/SignupPage.jsx
import React, { useState, useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; 

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            
            login(data.token);
            
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account.');
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4E1C1] dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-[#F4E1C1]/10 backdrop-blur-sm rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-[#6B3B1B] dark:text-white">Create an Account</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-[#4A2A14] dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md border-[#E0A050]/50 dark:bg-[#F4E1C1]/20 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C27B37]"
                        required
                    />
                </div>
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
                <div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-[#6B3B1B] rounded-md hover:bg-[#4A2A14] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B3B1B]">
                        Sign Up
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-[#8B6A50] dark:text-gray-400">
                Already have an account? <Link to="/login" className="font-medium text-[#6B3B1B] hover:underline dark:text-[#E0A050]">Log in</Link>
            </p>
        </div>
    </div>
);
};

export default SignupPage;