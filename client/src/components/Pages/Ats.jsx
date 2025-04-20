import React, { useState, useCallback } from "react";
import axios from "axios";
// import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ATS = () => {
  const [uploadOption, setUploadOption] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Use your .env variable for backend URL
  const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const jobLevels = [
    "Fresher",
    "Intern",
    "SDE",
    "PE",
    "PSE",
    "Full Stack Developer",
  ];

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please upload a PDF or Word document");
    }
  }, []);

  const fetchResumeFromDB = useCallback(async () => {
    setError("");
    try {
      // const res = await axios.get(`${backend}/api/resume`, {
      const res = await axios.get(`${backend}/api/resume`, {
        responseType: "blob",
      });
      // Convert blob to File so FormData can use it
      const file = new File([res.data], "resume.pdf", { type: res.data.type });
      setSelectedFile(file);
      setUploadOption("fetch");
    } catch (err) {
      setError("Failed to fetch resume from database");
    }
  }, [backend]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("resume", selectedFile);
        formData.append("jobTitle", jobTitle);

        const { data } = await axios.post(
          `${backend}/api/calculate-ats`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (!data.success) throw new Error(data.message || "Unknown error");
        setScore(data.score);
        setSuggestions(data.suggestions);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Error processing your request. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [backend, jobTitle, selectedFile]
  );

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          ATS Score Calculator
        </h2>

        <div className="mb-6 flex gap-4 justify-center">
          <button
            onClick={() => setUploadOption("upload")}
            className={`px-4 py-2 rounded-lg ${
              uploadOption === "upload"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={fetchResumeFromDB}
            className={`px-4 py-2 rounded-lg ${
              uploadOption === "fetch"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            Fetch from Database
          </button>
        </div>

        {uploadOption === "upload" && (
          <div className="mb-6 flex justify-center">
            <label className="block mb-2 text-purple-800 font-medium flex justify-center">
              Upload Resume (PDF/DOCX)
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="mt-1 block w-full text-sm text-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </label>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-purple-800 font-medium">
            Select Job Level/Title
            <select
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-purple-200 bg-white py-2 px-3 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a job level/title</option>
              {jobLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedFile || !jobTitle}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Calculating..." : "Calculate ATS Score"}
        </button>

        {score !== null && (
          <div className="mt-8 p-6 bg-purple-50 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              Your ATS Score: <span className="text-purple-600">{score}%</span>
            </h3>
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="text-xl font-semibold text-purple-800 mb-3">
                Improvement Suggestions:
              </h4>
              <div className="text-purple-700 whitespace-pre-wrap">
                {/* <div className="prose max-w-none text-purple-700"> */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {suggestions}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATS;
