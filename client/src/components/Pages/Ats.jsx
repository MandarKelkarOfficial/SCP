import React, { useState, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ATS = () => {
  const [uploadOption, setUploadOption] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("Full Stack Developer");
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Use your .env variable for backend URL
  const backend = process.env.REACT_APP_BACKEND;

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
      console.log("Received jobTitle:", jobTitle);
      console.log("Received file:", file);
    } else {
      setError("Please upload a PDF or Word document");
    }
  }, []);

  const fetchResumeFromDB = useCallback(async () => {
    setError("");
    try {
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

      if (!selectedFile || !jobTitle.trim()) {
        setError("Please select a file and a job title");
        setIsLoading(false);
        return;
      }

      console.log("Sending jobTitle:", jobTitle);
      console.log("Sending file:", selectedFile?.name);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            Applicant Tracking System
          </h1>
          <p className="text-blue-600">
            Optimize your resume for better job opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Resume Quality Score
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {score !== null ? `${score}%` : "—"}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${score !== null ? score : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Job Match Analysis
              </h3>
              <p className="text-sm text-blue-600">
                Compare your resume against the job requirements
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Optimization Tips
              </h3>
              <ul className="text-sm text-blue-600 list-disc pl-5 mt-2">
                <li>Use relevant keywords from job description</li>
                <li>Highlight quantifiable achievements</li>
                <li>Keep formatting clean and consistent</li>
              </ul>
            </div>
          </div>

          {/* Main Content - Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                ATS Score Calculator
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-3">
                  Resume Source
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUploadOption("upload")}
                    className={`flex-1 px-4 py-3 rounded-lg border ${
                      uploadOption === "upload"
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                        : "bg-white border-gray-300 text-gray-700"
                    } transition-colors`}
                  >
                    Upload Resume
                  </button>
                  <button
                    onClick={fetchResumeFromDB}
                    className={`flex-1 px-4 py-3 rounded-lg border ${
                      uploadOption === "fetch"
                        ? "bg-purple-100 border-purple-500 text-purple-700 font-medium"
                        : "bg-white border-gray-300 text-gray-700"
                    } transition-colors`}
                  >
                    Fetch from Database
                  </button>
                </div>
              </div>

              {uploadOption === "upload" && (
                <div className="mb-6">
                  <label className="block mb-2 text-blue-800 font-medium">
                    Upload Resume (PDF/DOCX)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-blue-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-blue-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-blue-400">
                          PDF, DOC, DOCX (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-blue-700">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-blue-800 font-medium">
                  Select Job Level/Title
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white py-3 px-4 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a job level/title</option>
                  {jobLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedFile || !jobTitle}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  "Calculate ATS Score"
                )}
              </button>

              {score !== null && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">
                    Your ATS Score: <span className="text-blue-600">{score}%</span>
                  </h3>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <h4 className="text-xl font-semibold text-blue-800 mb-3">
                      Improvement Suggestions:
                    </h4>
                    <div className="text-blue-700 whitespace-pre-wrap text-wrap">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p
                              className="break-words whitespace-pre-wrap"
                              {...props}
                            />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="break-words bg-gray-100 px-1 rounded"
                                {...props}
                              />
                            ) : (
                              <pre
                                className="overflow-x-auto break-words"
                                {...props}
                              />
                            ),
                        }}
                      >
                        {suggestions}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATS;