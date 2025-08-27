import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      <Header isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main
          className="flex-1 p-8 transition-all duration-300"
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
