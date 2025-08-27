import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBriefcase,
  faFileAlt,
  faBook,
  faGamepad,
  faExternalLink,
  faSuitcase,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ sidebarOpen = true }) => {
  return (
    <div
      className={`bg-purple-600 text-white min-h-full transition-all duration-300 overflow-hidden ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div
        className={`p-6 text-2xl font-bold flex items-center ${
          sidebarOpen ? 'justify-start' : 'justify-center'
        }`}
      >
        {sidebarOpen ? 'Dashboard' : <span className="sr-only">Menu</span>}
      </div>

      <nav className="mt-4">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faUser} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Profile</span>}
        </NavLink>

        <NavLink
          to="/dashboard/ats"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faBriefcase} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>ATS</span>}
        </NavLink>

        <NavLink
          to="/dashboard/generate-resume"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faFileAlt} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Generate Resume</span>}
        </NavLink>

        <NavLink
          to="/dashboard/courses"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faBook} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Courses</span>}
        </NavLink>

        <NavLink
          to="/dashboard/playfield"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faGamepad} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Playfield</span>}
        </NavLink>

        <NavLink
          to="/dashboard/jobs"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faSuitcase} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Jobs</span>}
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-3 px-6 hover:bg-purple-700 ${isActive ? 'bg-purple-700' : ''} ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`
          }
        >
          <FontAwesomeIcon icon={faExternalLink} className={sidebarOpen ? 'mr-3' : ''} />
          {sidebarOpen && <span>Logout</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
