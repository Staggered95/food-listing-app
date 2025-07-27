// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-100/40 dark:bg-green-900/40 text-gray-600 dark:text-gray-400 mt-16 border-t dark:border-green-800 rounded-t-xl">
      <div className="container mx-auto px-6 py-12">
        {/* Main footer content with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand and Tagline */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Allahabadia Food Corner</h3>
            <p className="mt-2 text-sm">
              Authentic flavors, delivered fresh to your door. A taste of tradition in every bite.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="hover:text-green-500">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-500">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-500">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              {/* Facebook Icon */}
              <a href="#" className="hover:text-green-500" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="#" className="hover:text-green-500" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266.058 1.644.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                </svg>
              </a>
              {/* Twitter/X Icon */}
              <a href="#" className="hover:text-green-500" aria-label="Twitter">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                 </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Allahabadia Food Corner. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;