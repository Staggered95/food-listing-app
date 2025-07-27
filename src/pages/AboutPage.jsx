// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">Our Story</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            From the heart of Allahabad to your plate.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              className="rounded-lg shadow-xl object-cover w-full h-80" 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdGF1cmFudCUyMGtpdGNoZW58ZW58MHx8MHx8fDA%3D" 
              alt="Restaurant Kitchen" 
            />
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">A Tradition of Taste</h2>
            <p className="mb-4">
              Allahabadia Food Corner was born from a passion for authentic Indian cuisine. Our journey began in a small kitchen, with family recipes passed down through generations. Our mission is to share the rich culinary heritage of the Allahabad region, using only the freshest ingredients and traditional cooking methods.
            </p>
            <p>
              We believe that food is more than just sustenance; it's an experience. It’s about family, community, and creating memories. We invite you to be a part of our story and taste the tradition in every bite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;