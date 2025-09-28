import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Upload from './pages/upload';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingFeedback from './components/FloatingFeedback';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(prev => !prev)} />

        <main className="flex-grow px-4 md:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/admin" element={<AdminDashboard />} /> 
          </Routes>
        </main>

        <Footer />

        {/* 🆕 Floating Feedback Button */}
        <FloatingFeedback />
      </div>
    </Router>
  );
}

export default App;
