// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for food..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 text-[#8B6A50] bg-[#6B3B1B]/20 dark:bg-[#F4E1C1]/20 dark:text-white border-2 border-transparent rounded-full focus:outline-none focus:border-[#6B3B1B] transition-colors"
      />
      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B6A50]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
  );
};

export default SearchBar;