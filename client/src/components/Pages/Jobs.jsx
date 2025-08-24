// frontend/src/components/Jobs.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Jobs() {
  const [keywords, setKeywords] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchJobs = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8000/jobs', {
        params: { keywords }
      });
      setJobs(response.data.jobs);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-8">Find Jobs (Posted Today)</h1>
        <form onSubmit={searchJobs} className="bg-purple-50 p-6 rounded-lg shadow-md mb-8 space-y-4">
          <input
            type="text"
            placeholder="Enter skill or job title"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border border-purple-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-600">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.locations}</p>
              <p className="text-sm text-gray-400">{job.date}</p>
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
      </div>
    </div>
  );
}
