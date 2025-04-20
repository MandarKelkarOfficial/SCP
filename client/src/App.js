import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Pages/Profile';
import ATS from './components/Pages/Ats';
import GenerateResume from './components/Pages/GenrateResume';
import CourseRecommender from './components/Pages/CourseRecommender';
import Playfield from './components/Pages/Playfield';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OtpVerification from './components/Auth/OtpVerification';
import Jobs from './components/Pages/Jobs';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login route at "/" */}
        <Route path="/" element={<Login />} />
        {/* Register route */}
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        {/* Dashboard and its nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Default page */}
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ats" element={<ATS />} />
          <Route path="generate-resume" element={<GenerateResume />} />
          <Route path="courses" element={<CourseRecommender />} />
          <Route path="playfield" element={<Playfield />} />
          <Route path="jobs" element={<Jobs/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
