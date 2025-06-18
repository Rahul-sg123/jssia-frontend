import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center py-6 mt-12 text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 px-4">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-sm">
        <p className="font-medium">Done by <strong>Rahul Guggilla</strong></p>
        <a
          href="https://www.linkedin.com/in/rahulguggilla"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 underline hover:text-blue-500"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn"
            className="w-4 h-4"
          />
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
