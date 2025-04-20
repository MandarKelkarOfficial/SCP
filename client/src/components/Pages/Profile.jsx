import React, { useState } from "react";
import Img from '../Assets/img/initial.jpeg'

const Profile = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Profile Card */}
      <div className="relative bg-white shadow-lg rounded-lg p-8 w-[400px] md:w-[500px] lg:w-[550px] hover:shadow-2xl transition-all">
        
        {/* Profile Image at the Top-Center */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-purple-600 p-1 bg-white shadow-md">
          <img
            src={Img} // Replace with actual user image
            alt="User"
            className="w-full h-full rounded-full cursor-pointer object-cover"
            onClick={toggleFullScreen}
          />
        </div>

        {/* User Information */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-purple-800">Maddy K</h2>
          <p className="text-gray-600 text-lg">Software Engineer | Blockchain Developer</p>
          <p className="text-gray-500 mt-3">
            Passionate about full-stack development and AI-driven solutions.
          </p>
        </div>
      </div>

      {/* Fullscreen Circular Image */}
      {isFullScreen && (
  <div
    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50"
    onClick={toggleFullScreen} // Clicking closes fullscreen
  >
    <img
      src={Img} 
      alt="User"
      className="w-[300px] md:w-[350px] lg:w-[400px] 
                 h-[300px] md:h-[350px] lg:h-[400px] 
                 border-4 border-purple-600 object-cover 
                 rounded-xl"  // Change this to rounded-lg or rounded-2xl for different curvatures
    />
  </div>
)}

    </div>
  );
};

export default Profile;