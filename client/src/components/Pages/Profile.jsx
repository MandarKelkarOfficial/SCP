import React, { useState, useEffect } from "react";
import Img from '../Assets/img/initial.jpeg';

const CareerPathGraph = ({ data }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const graphHeight = 200;
  const graphWidth = 500; // Fixed width for better line calculation
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };

  const getStatusColor = (status) => {
    switch(status) {
      case 'best': return '#9333ea';
      case 'good': return '#fb923c';
      case 'neutral': return '#4ade80';
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
    <div className="mt-4 p-6 bg-white rounded-lg shadow-md w-full max-w-3xl">
      <h3 className="text-xl font-semibold text-purple-800 mb-4">Career Path Analysis</h3>
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
            stroke="#c084fc"
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
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Profile Card */}
      <div className="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mb-8 hover:shadow-2xl transition-all">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-purple-600 p-1 bg-white shadow-md">
          <img
            src={Img}
            alt="User"
            className="w-full h-full rounded-full cursor-pointer object-cover"
            onClick={toggleFullScreen}
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-purple-800">Maddy K</h2>
          <p className="text-gray-600 text-lg">Software Engineer | Blockchain Developer</p>
          <p className="text-gray-500 mt-3">
            Passionate about full-stack development and AI-driven solutions.
          </p>
        </div>
      </div>

      {/* Graph Card - Separate from Profile Card */}
      <CareerPathGraph data={careerData} />

      {/* Fullscreen Image */}
      {isFullScreen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50"
          onClick={toggleFullScreen}
        >
          <img
            src={Img}
            alt="User"
            className="w-[300px] md:w-[350px] lg:w-[400px] h-[300px] md:h-[350px] lg:h-[400px] border-4 border-purple-600 object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;