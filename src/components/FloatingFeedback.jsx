import React, { useState } from 'react';
import axios from 'axios';

export default function FloatingFeedback() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await axios.post('https://jssia-backend.onrender.com/api/feedback', formData);
      setStatus(res.data.message);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setShowModal(false);
        setStatus('');
      }, 2000);
    } catch (err) {
      setStatus('Failed to send feedback.');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
  onClick={() => setShowModal(true)}
  className="fixed bottom-6 sm:bottom-6 md:bottom-8 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm sm:text-base"
>
  Feedback
</button>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto px-4 py-6 sm:p-0">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300 text-center">
              We value your feedback
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your Name (optional)"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your Email (optional)"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <textarea
                name="message"
                value={formData.message}
                placeholder="Write your message..."
                required
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                >
                  Submit
                </button>
              </div>
            </form>

            {status && (
              <p className="mt-4 text-sm text-green-600 dark:text-green-400 text-center">
                {status}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
