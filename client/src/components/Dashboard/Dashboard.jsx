import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
