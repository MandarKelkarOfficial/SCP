import { useState } from 'react';
import coursesData from '../Assets/data/courses.json';

const CourseRecommender = () => {
  const [searchSubject, setSearchSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const extractSubjects = (skillsString) => {
    return skillsString.split(' ').filter(skill => skill.trim() !== '');
  };

  const getTopCourses = () => {
    if (!selectedSubject) return [];
    
    return coursesData
      .filter(course => {
        const lowerSubject = selectedSubject.toLowerCase();
        return (
          course['Course Name'].toLowerCase().includes(lowerSubject) ||
          course.University.toLowerCase().includes(lowerSubject) ||
          extractSubjects(course.Skills.toLowerCase()).some(skill => 
            skill.includes(lowerSubject))
        );
      })
      .sort((a, b) => parseFloat(b['Course Rating']) - parseFloat(a['Course Rating']))
      .slice(0, 3);
  };

  const topCourses = getTopCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
              Course Recommender
            </h1>
            <p className="text-blue-600 max-w-2xl mx-auto">
              Discover the best courses tailored to your interests from top universities worldwide
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Search Courses
                </label>
                <input
                  type="text"
                  placeholder="Enter subject, university or skill (e.g., Screenwriting, Michigan)"
                  className="px-4 py-3 rounded-lg border border-blue-200 w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setSelectedSubject(searchSubject)}
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-medium text-blue-700 mb-2 invisible md:visible">
                  &nbsp;
                </label>
                <button
                  onClick={() => setSelectedSubject(searchSubject)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center h-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Search Courses
                </button>
              </div>
            </div>
          </div>

          {selectedSubject && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Top courses for: <span className="text-purple-600">{selectedSubject}</span>
              </h2>
              <p className="text-blue-600">
                {topCourses.length} course{topCourses.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {topCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2 line-clamp-2">
                          {course['Course Name']}
                        </h3>
                        <p className="text-purple-700 font-medium mb-1">
                          {course.University}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 mr-3">
                          <svg className="w-10 h-10" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-100" strokeWidth="2"/>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-purple-600" strokeWidth="2" 
                              strokeDasharray="100" strokeDashoffset={100 - (parseFloat(course['Course Rating']) * 20)}/>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-purple-700">
                            {course['Course Rating'] ? (parseFloat(course['Course Rating']) * 20).toFixed(0) : '0'}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-900">
                            Rating: {course['Course Rating']}/5
                          </div>
                          <div className="text-xs text-blue-600">
                            {course['Difficulty Level']}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course['Course Description']}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                        Skills You'll Learn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {extractSubjects(course.Skills).slice(0, 4).map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                        {extractSubjects(course.Skills).length > 4 && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            +{extractSubjects(course.Skills).length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={course['Course URL']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      View Course Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            selectedSubject && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  No courses found matching "{selectedSubject}"
                </h3>
                <p className="text-blue-600">
                  Try searching for different subjects, universities, or skills
                </p>
              </div>
            )
          )}

          {!selectedSubject && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Browse by Subject</h3>
                <p className="text-blue-600 text-sm">Find courses in programming, business, arts, and more</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Top Universities</h3>
                <p className="text-purple-600 text-sm">Discover courses from leading institutions worldwide</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Skill-Based Learning</h3>
                <p className="text-blue-600 text-sm">Search for courses that teach specific skills you want to acquire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRecommender;