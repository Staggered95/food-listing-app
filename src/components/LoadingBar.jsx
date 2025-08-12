// src/components/LoadingBar.jsx
import React from 'react';
import { useLoading } from '../context/LoadingContext';

const LoadingBar = () => {
  const { isLoading } = useLoading();

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-1 bg-[#C27B37] z-[9999] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      style={{
        // A simple animation to give a sense of progress
        animation: isLoading ? 'loading-bar-animation 2s linear infinite' : 'none',
        backgroundSize: '200% 100%',
        backgroundImage: 'linear-gradient(to right, #C27B37 50%, #E0A050 100%)',
      }}
    />
  );
};

export default LoadingBar;