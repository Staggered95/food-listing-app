// src/pages/AboutPage.jsx
import React from 'react';
import founderImage from '../assets/images/founder.jpg';
// import chefImage from '../assets/images/head-chef.jpg';
// import teamImage from '../assets/images/team-photo.jpg';

const AboutPage = () => {
  return (
    <div className="bg-[#F4E1C1] dark:bg-gray-950">
      <div className="container mx-auto px-6 py-16">

        {/* --- Hero Section --- */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#4A2A14] dark:text-white md:text-5xl">
            Our Story
          </h1>
          <p className="mt-4 text-lg text-[#8B6A50] dark:text-gray-300">
            From the heart of Allahabad to your plate, a tradition of taste.
          </p>
        </div>

        {/* --- Founder's Story Section --- */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              className="rounded-lg shadow-xl object-cover w-full h-96"
              // Replace this with your founder's image
              src={founderImage}
              alt="Founder of Allahabadia Food Corner"
            />
          </div>
          <div className="text-[#8B6A50] dark:text-gray-300">
            <h2 className="text-3xl font-semibold mb-4 text-[#6B3B1B] dark:text-white">
              Meet Our Founder
            </h2>
            <p className="mb-4">
              Allahabadia Food Court was born from a passion for authentic Indian cuisine. Our journey began in a small kitchen, with family recipes passed down through generations. Our mission is to share the rich culinary heritage of the Allahabad region, using only the freshest ingredients and traditional cooking methods.
            </p>
            <p className="font-semibold italic text-[#4A2A14] dark:text-gray-200 mt-4">
              "Food is more than just sustenance; it's an experience. It’s about family, community, and creating memories. We invite you to be a part of our story and taste the tradition in every bite."
            </p>
          </div>
        </div>

        {/* --- Meet the Team Section --- */}
        <div className="mt-20">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#4A2A14] dark:text-white md:text-4xl">
                    Our Culinary Artists
                </h2>
                <p className="mt-4 text-lg text-[#8B6A50] dark:text-gray-300">
                    The heart of our kitchen, dedicated to perfection.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div className="text-center">
                    <img
                        className="w-40 h-40 mx-auto rounded-full shadow-lg object-cover"
                        // Replace with your Head Chef's image
                        src="#"
                        alt="Head Chef"
                    />
                    <h3 className="mt-4 text-xl font-bold text-[#6B3B1B] dark:text-white">
                        Head Chef
                    </h3>
                    <p className="text-[#8B6A50] dark:text-gray-400">Head Chef</p>
                </div>
                 
                 {/* Team Member 3 */}
                 <div className="text-center">
                    <img
                        className="w-40 h-40 mx-auto rounded-full shadow-lg object-cover"
                        // Replace with another team member's image
                        src="#"
                        alt="Dessert Chef"
                    />
                    <h3 className="mt-4 text-xl font-bold text-[#6B3B1B] dark:text-white">
                        Dessert Chef
                    </h3>
                    <p className="text-[#8B6A50] dark:text-gray-400">Dessert Chef</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;