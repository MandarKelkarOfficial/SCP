import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faFileAlt, faBook, faGamepad, faExternalLink } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="bg-purple-600 text-white w-64 min-h-full">
      <div className="p-6 text-2xl font-bold">Dashboard</div>
      <nav className="mt-4">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" /> Profile
        </NavLink>
        <NavLink
          to="/dashboard/ats"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faBriefcase} className="mr-3" /> ATS
        </NavLink>
        <NavLink
          to="/dashboard/generate-resume"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faFileAlt} className="mr-3" /> Generate Resume
        </NavLink>
        <NavLink
          to="/dashboard/courses"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faBook} className="mr-3" /> Courses
        </NavLink>
        <NavLink
          to="/dashboard/playfield"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faGamepad} className="mr-3" /> Playfield
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''}`
          }
        >
          <FontAwesomeIcon icon={faExternalLink} className="mr-3" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
