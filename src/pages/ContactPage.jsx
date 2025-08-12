// src/pages/ContactPage.jsx
import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import AuthContext from '../context/AuthContext'; 

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      const { data } = await axios.post('/api/contact', formData);
      setStatusMessage({ type: 'success', text: data.message });
      // Clear only the message field on success if the user is logged in
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4E1C1] dark:bg-black">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4A2A14] dark:text-white md:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-[#8B6A50] dark:text-gray-300">
            We'd love to hear from you. Whether it's feedback, a query, or a simple hello.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#F4E1C1]/50 dark:bg-[#F4E1C1]/10 p-8 rounded-lg shadow-lg">
          {/* Contact Information */}
          <div className="text-[#8B6A50] dark:text-gray-300">
            <h3 className="text-2xl font-semibold mb-6 text-[#6B3B1B] dark:text-white">Contact Details</h3>
            <div className="space-y-4">
              <p><strong>Address:</strong> ------- </p>
              <p><strong>Phone:</strong> -------</p>
              <p><strong>Email:</strong> --------</p>
              <p><strong>Hours:</strong> --------</p>
            </div>
          </div>

          {/* Functional Contact Form */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#6B3B1B] dark:text-white">Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full p-3 rounded-md bg-white dark:bg-[#F4E1C1]/20 border border-[#E0A050]/50 dark:text-white dark:border-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full p-3 rounded-md bg-white dark:bg-[#F4E1C1]/20 border border-[#E0A050]/50 dark:text-white dark:border-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="w-full p-3 rounded-md bg-white dark:bg-[#F4E1C1]/20 border border-[#E0A050]/50 dark:text-white dark:border-gray-700"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6B3B1B] text-white p-3 rounded-md font-semibold hover:bg-[#4A2A14] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
              {statusMessage && (
                <p className={`text-sm text-center mt-4 ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {statusMessage.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;