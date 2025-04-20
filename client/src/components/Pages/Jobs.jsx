import React, { useState } from 'react';
import axios from 'axios';

export default function Jobs() {
  const [searchType, setSearchType] = useState('manual');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [salary, setSalary] = useState('');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  // Sample predefined skills (replace with your database fetch)
  const predefinedSkills = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'AWS', 'Docker', 'SQL'];

  const searchJobs = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('https://api.careerjet.com/jobs', {
        params: {
          keywords,
          location,
          contracttype: contractType,
          salary,
          page,
          aff_id: 'YOUR_AFFILIATE_ID', // Replace with your affiliate ID
          user_ip: 'USER_IP', // Add user IP detection
          user_agent: 'USER_AGENT', // Add user agent detection
          api_key: apiKey,
        }
      });
      
      setJobs(response.data.jobs);
    } catch (err) {
      setError('Failed to fetch jobs. Please check your API key and parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-8">Find Your Dream Job</h1>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchType('manual')}
              className={`px-4 py-2 rounded ${searchType === 'manual' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-600'}`}
            >
              Enter Manually
            </button>
            <button
              onClick={() => setSearchType('skills')}
              className={`px-4 py-2 rounded ${searchType === 'skills' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-600'}`}
            >
              Select Skills
            </button>
          </div>

          <form onSubmit={searchJobs} className="space-y-4">
            <div>
              {searchType === 'manual' ? (
                <input
                  type="text"
                  placeholder="Enter job keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded"
                  required
                />
              ) : (
                <select
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded"
                  required
                >
                  <option value="">Select a skill</option>
                  {predefinedSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-2 border border-purple-300 rounded"
              />
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="p-2 border border-purple-300 rounded"
              >
                <option value="">Contract Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
              <input
                type="number"
                placeholder="Minimum Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="p-2 border border-purple-300 rounded"
              />
              <input
                type="password"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="p-2 border border-purple-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-purple-300"
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-600">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.locations}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-purple-500">{job.salary}</span>
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {job.contracttype}
                </span>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-purple-600 hover:underline"
              >
                View Job →
              </a>
            </div>
          ))}
        </div>

        {jobs.length > 0 && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-300"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}