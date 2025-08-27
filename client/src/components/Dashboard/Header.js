import React from 'react';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-purple-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="mr-4 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        <h1 className="text-xl font-bold">Talentsinc Solutions</h1>
      </div>
    </header>
  );
};

export default Header;
