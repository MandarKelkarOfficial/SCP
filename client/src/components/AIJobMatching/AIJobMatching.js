import React, { useState } from 'react';
import axios from 'axios';

const AIJobMatching = () => {
  const [profile, setProfile] = useState('');
  const [matches, setMatches] = useState([]);

  const handleMatch = async () => {
    try {
      const response = await axios.post('/api/ai/matching', { profile });
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Matching error:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <textarea
        className="w-full p-2 border rounded"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
        placeholder="Enter your profile..."
      />
      <button 
        onClick={handleMatch}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Find Matches
      </button>
      
      {matches.map((job, index) => (
        <div key={index} className="mt-4 p-3 border rounded">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <p className="text-sm text-green-700">Match Score: {job.score}%</p>
        </div>
      ))}
    </div>
  );
};

export default AIJobMatching;