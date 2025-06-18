import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="bg-white text-primary px-3 py-1 rounded font-semibold"
      aria-label="Toggle dark mode"
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
