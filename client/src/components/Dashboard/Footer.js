import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white p-4 ">
      <div className="max-w-6xl mx-auto text-center">
        &copy; {new Date().getFullYear()} My Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
