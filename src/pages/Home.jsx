import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyAvatar from '../components/MyAvatar';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key === 'A') {
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
  <div className="z-20 pointer-events-none">
  {/* Mobile view */}
  <div className="sm:hidden fixed bottom-28 left-1/2 transform -translate-x-1/2 w-60 h-56 overflow-hidden">
    <MyAvatar />
  </div>

  {/* Desktop view */}
  <div className="hidden sm:block absolute bottom-6 left-5 w-48 h-40">
    <MyAvatar />
  </div>
</div>



      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          Welcome to JSS IA Paper Library
        </h1>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
          Browse question papers or submit your IA paper below.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/Browse"
            className="px-6 py-3 rounded font-semibold 
                       bg-gray-300 text-gray-800 hover:bg-gray-400 
                       dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition"
          >
            Browse Papers
          </Link>

          <Link
            to="/Upload"
            className="px-6 py-3 rounded font-semibold 
                       bg-gray-300 text-gray-800 hover:bg-gray-400 
                       dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition"
          >
            Submit IA Paper
          </Link>

          {showAdmin && (
            <Link
              to="/admin"
              className="px-6 py-3 rounded font-semibold 
                         bg-gray-300 text-gray-800 hover:bg-gray-400 
                         dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <p className="fixed bottom-3 left-3 sm:bottom-4 sm:left-6 text-[10px] sm:text-xs text-gray-800 dark:text-gray-500 z-50 whitespace-nowrap">
  {showAdmin ? 'Admin unlocked!' : 'Shift+A : Admin access'}
</p>


    </div>
  );
}
