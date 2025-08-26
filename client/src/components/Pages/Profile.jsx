import React, { useState, useEffect } from "react";
import Img from '../Assets/img/initial.jpeg';

const CareerPathGraph = ({ data }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const graphHeight = 200;
  const graphWidth = 500;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };

  const getStatusColor = (status) => {
    switch(status) {
      case 'best': return '#8b5cf6';
      case 'good': return '#3b82f6';
      case 'neutral': return '#10b981';
      case 'bad': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const calculatePosition = (index, score) => {
    const x = margin.left + (index * (graphWidth - margin.left - margin.right)) / (data.length - 1);
    const y = margin.top + ((10 - score) * (graphHeight - margin.top - margin.bottom) / 10);
    return { x, y };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Career Path Analysis</h3>
        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          View Details
        </button>
      </div>
      <div className="relative" style={{ width: '100%', height: graphHeight }}>
        <svg width="100%" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
          {/* Y-axis */}
          {[0, 2, 4, 6, 8, 10].map((tick) => (
            <g key={tick}>
              <text
                x={margin.left - 15}
                y={margin.top + ((10 - tick) * (graphHeight - margin.top - margin.bottom) / 10 + 4)}
                className="text-xs fill-gray-500"
              >
                {tick}
              </text>
              <line
                x1={margin.left}
                y1={margin.top + ((10 - tick) * (graphHeight - margin.top - margin.bottom) / 10)}
                x2={graphWidth - margin.right}
                y2={margin.top + ((10 - tick) * (graphHeight - margin.top - margin.bottom) / 10)}
                className="stroke-gray-200"
                strokeDasharray="4 2"
              />
            </g>
          ))}

          {/* Connection line */}
          <path
            d={`M ${data.map((item, index) => {
              const pos = calculatePosition(index, item.score);
              return `${pos.x},${pos.y}`;
            }).join(' L ')}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const pos = calculatePosition(index, item.score);
            return (
              <g
                key={item.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <circle
                  r="6"
                  fill={getStatusColor(item.status)}
                  className="cursor-pointer transition-transform hover:scale-125"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          <g transform={`translate(0, ${graphHeight - margin.bottom + 10})`}>
            {data.map((item, index) => {
              const pos = calculatePosition(index, 0);
              return (
                <text
                  key={item.id}
                  x={pos.x}
                  y="0"
                  className="text-xs fill-gray-600"
                  textAnchor="middle"
                >
                  {item.name}
                </text>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredItem && (
          <div
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-10"
            style={{
              left: `${calculatePosition(data.findIndex(item => item.id === hoveredItem.id), hoveredItem.score).x * 100 / graphWidth}%`,
              top: `${calculatePosition(0, hoveredItem.score).y - 30}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-semibold">{hoveredItem.name}</div>
            <div>Score: {hoveredItem.score}/10</div>
            <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
        </p>
      </div>
      <div className="bg-indigo-100 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const SkillProgress = ({ name, level }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-gray-700">{name}</span>
      <span className="text-sm font-medium text-gray-500">{level}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600" 
        style={{ width: `${level}%` }}
      ></div>
    </div>
  </div>
);

const Profile = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [careerData, setCareerData] = useState([]);

  const testData = [
    { id: 1, name: "AI Engineer", score: 9, status: "best" },
    { id: 2, name: "Web Developer", score: 7, status: "good" },
    { id: 3, name: "Data Analyst", score: 5, status: "neutral" },
    { id: 4, name: "Marketing", score: 3, status: "bad" },
  ];

  useEffect(() => {
    setCareerData(testData);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Icons for stats cards (using simple emojis for demonstration)
  const stats = [
    { title: "Projects Completed", value: "42", change: 12, icon: "📊" },
    { title: "Skills Mastered", value: "18", change: 5, icon: "🚀" },
    { title: "Satisfaction Rate", value: "98%", change: 2, icon: "⭐" },
  ];

  const skills = [
    { name: "React.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "UI/UX Design", level: 75 },
    { name: "Blockchain", level: 82 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Maddy! Here's your career overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 h-24 relative">
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white p-1 bg-white shadow-lg">
                  <img
                    src={Img}
                    alt="User"
                    className="w-full h-full rounded-full cursor-pointer object-cover"
                    onClick={toggleFullScreen}
                  />
                </div>
              </div>
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">Maddy K</h2>
                <p className="text-gray-600 text-sm">Software Engineer | Blockchain Developer</p>
                <p className="text-gray-500 text-sm mt-3">
                  Passionate about full-stack development and AI-driven solutions.
                </p>
                
                <div className="mt-6 flex justify-center space-x-3">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Message
                  </button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Connect
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-center">
                  <div>
                    <p className="text-gray-800 font-semibold">86</p>
                    <p className="text-xs text-gray-500">Connections</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">24</p>
                    <p className="text-xs text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">3.8</p>
                    <p className="text-xs text-gray-500">Years Exp</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
              {skills.map((skill, index) => (
                <SkillProgress key={index} name={skill.name} level={skill.level} />
              ))}
              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Show all skills →
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <CareerPathGraph data={careerData} />
            
            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <span className="text-blue-600">📝</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Completed AI Engineer course</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <span className="text-purple-600">🏆</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Earned Blockchain Developer badge</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <span className="text-green-600">🔗</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Connected with Sarah Johnson</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Goals Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Goals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-md mr-3">
                      <div className="w-6 h-6 rounded border border-indigo-300 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Senior Developer Role</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">Q2 2023</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-md mr-3">
                      <div className="w-6 h-6 rounded border border-blue-300 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Learn Cloud Architecture</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Ongoing</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-md mr-3">
                      <div className="w-6 h-6 rounded border border-purple-300 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Publish Technical Blog</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Q3 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image */}
      {isFullScreen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50"
          onClick={toggleFullScreen}
        >
          <img
            src={Img}
            alt="User"
            className="w-[300px] md:w-[350px] lg:w-[400px] h-[300px] md:h-[350px] lg:h-[400px] border-4 border-indigo-600 object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;