// src/pages/ContactPage.jsx
import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We'd love to hear from you. Whether it's feedback, a query, or a simple hello.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          {/* Contact Information */}
          <div className="text-gray-700 dark:text-gray-300">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Contact Details</h3>
            <div className="space-y-4">
              <p><strong>Address:</strong> 123 Food Street, Prayagraj, Uttar Pradesh</p>
              <p><strong>Phone:</strong> +91 123 456 7890</p>
              <p><strong>Email:</strong> contact@allahabadiafood.com</p>
              <p><strong>Hours:</strong> 11:00 AM - 11:00 PM, Daily</p>
            </div>
          </div>

          {/* Contact Form (UI Only) */}
          <div>
             <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Send Us a Message</h3>
            <form>
              <div className="mb-4">
                <input type="text" placeholder="Your Name" className="w-full p-3 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700" />
              </div>
              <div className="mb-4">
                <input type="email" placeholder="Your Email" className="w-full p-3 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700" />
              </div>
              <div className="mb-4">
                <textarea rows="5" placeholder="Your Message" className="w-full p-3 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700">
                Submit
              </button>
              <p className="text-xs text-center mt-2 dark:text-gray-500">Note: This form is for display only and is not functional.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;