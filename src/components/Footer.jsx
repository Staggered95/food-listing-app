// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 mt-12 py-8">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">YumYard</h3>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-green-500">About Us</a>
          <a href="#" className="hover:text-green-500">Contact Us</a>
          <a href="#" className="hover:text-green-500">Privacy Policy</a>
        </div>
        <p className="mt-6 text-sm">&copy; {new Date().getFullYear()} YumYard. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;