import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`w-full shadow-md transition-colors duration-300 ${
        darkMode ? 'custom-dark-bg text-white' : 'bg-white text-purple-800'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
      
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/download.png"      
            alt="JSS IA Papers logo"
            className="h-10 w-auto"
          />
          
        </Link>

    
        <ul className="hidden md:flex gap-6 text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-purple-400">Home</Link>
          </li>
          <li>
            <Link to="/browse" className="hover:text-purple-400">Browse</Link>
          </li>
          <li>
            <Link to="/upload" className="hover:text-purple-400">Submit&nbsp;IA&nbsp;Paper</Link>
          </li>
        </ul>

        {/* ─────── Theme toggle + Hamburger (mobile) ─────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? 'bg-white text-purple-800 focus:ring-purple-600 focus:ring-offset-[#2e0f3a]'
                : 'bg-purple-100 text-purple-700 focus:ring-purple-600 focus:ring-offset-white'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* mobile menu button */}
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-purple-600 rounded"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ──────────────── Mobile nav links ──────────────── */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 pb-4 text-lg font-medium">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
          </li>
          <li>
            <Link to="/upload" onClick={() => setMenuOpen(false)}>Submit&nbsp;IA&nbsp;Paper</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
