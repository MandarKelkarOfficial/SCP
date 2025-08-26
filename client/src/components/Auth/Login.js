import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backend = process.env.REACT_APP_BACKEND;

  const handleLogin = async (e) => {
    e.preventDefault();

    // const response = await fetch("http://localhost:5000/api/login", {
    console.log("backend", backend);
    const response = await fetch(`${backend}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
      navigate("/dashboard", { state: { userName: username } });
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-purple-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-purple-800 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Smart Competency Diagnostic and 
            <br />
            <span className="text-yellow-300">Candidate Profile Score Calculator</span>
          </h2>
          <p className="mb-4 text-lg">
            The <strong>Smart Competency Diagnostic and Candidate Profile Score Calculator</strong> is an AI-driven tool that evaluates candidates' profiles by analyzing skills, experience, and qualifications against job requirements.
          </p>
          <p className="text-lg">
            Optimize your profile and improve your chances in the job market!
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-purple-800">LOGIN</h3>
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors mb-4"
            >
              Login
            </button>
          </form>
          <Link to="/register">
            <button className="w-full bg-gray-200 text-purple-800 py-2 rounded-md hover:bg-gray-300 transition-colors mb-4">
              Register
            </button>
          </Link>
          <div className="text-center">
            <p className="text-gray-600 mb-2">or sign up with:</p>
            <div className="flex justify-center space-x-4">

              <button className="text-red-600 hover:text-red-800">
                <FontAwesomeIcon icon={faGoogle} size="lg" />
              </button>
              <button className="text-gray-800 hover:text-black">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
