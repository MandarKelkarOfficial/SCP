import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Pages/Profile';
import ATS from './components/Pages/Ats';
import GenerateResume from './components/Pages/GenrateResume';
import Courses from './components/Pages/CourseRecommender';
import Playfield from './components/Pages/Playfield';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* Default page */}
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ats" element={<ATS />} />
          <Route path="generate-resume" element={<GenerateResume />} />
          <Route path="courses" element={<Courses />} />
          <Route path="playfield" element={<Playfield />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
