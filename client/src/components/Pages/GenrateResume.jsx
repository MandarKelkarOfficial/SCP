import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeTemplate = React.forwardRef(({ data }, ref) => {
  const {
    personalInfo,
    education,
    experience,
    publications,
    projects,
    technologies,
  } = data;
  
  return (
    <div ref={ref} className="p-8 bg-white text-gray-800 max-w-3xl mx-auto font-sans">
      <div className="bg-blue-50 p-6 rounded-lg mb-6 border-l-4 border-purple-600">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{personalInfo.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-blue-700">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-purple-200 pb-2 mb-4">
          Education
        </h2>
        {education.map((edu, i) => (
          <div key={i} className="mb-4 bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">
              {edu.degree}, {edu.institution}
            </p>
            <p className="text-sm text-blue-700">
              {edu.dates} {edu.gpa && `| GPA: ${edu.gpa}`}
            </p>
            {edu.coursework && <p className="text-sm mt-1">{edu.coursework}</p>}
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-purple-200 pb-2 mb-4">
          Experience
        </h2>
        {experience.map((exp, i) => (
          <div key={i} className="mb-4 bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">
              {exp.position} @ {exp.company}
            </p>
            <p className="text-sm text-blue-700">
              {exp.dates} {exp.location && `| ${exp.location}`}
            </p>
            <ul className="list-disc list-inside mt-2 pl-2">
              {exp.bullets.map((b, j) => (
                <li key={j} className="text-sm mb-1">{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {publications.length > 0 && publications[0].title && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-purple-200 pb-2 mb-4">
            Publications
          </h2>
          {publications.map((pub, i) => (
            <div key={i} className="mb-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-900">{pub.title}</p>
              <p className="text-sm text-blue-700">{pub.authors}</p>
              <p className="text-sm">
                {pub.doi && <>DOI: {pub.doi} | </>}
                {pub.date}
              </p>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && projects[0].name && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-purple-200 pb-2 mb-4">
            Projects
          </h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-900">
                {proj.link ? (
                  <a href={proj.link} className="text-purple-700 hover:underline">
                    {proj.name}
                  </a>
                ) : (
                  proj.name
                )}
              </p>
              <p className="text-sm">{proj.description}</p>
              {proj.tools && (
                <p className="text-sm text-blue-700 mt-1">Tools: {proj.tools}</p>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-purple-200 pb-2 mb-4">
          Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Languages</h3>
            <p className="text-sm">{technologies.languages}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Tools & Frameworks</h3>
            <p className="text-sm">{technologies.tools}</p>
          </div>
        </div>
      </section>
    </div>
  );
});

const GenerateResume = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      linkedin: "",
      github: "",
    },
    education: [
      { institution: "", degree: "", dates: "", gpa: "", coursework: "" },
    ],
    experience: [
      { position: "", company: "", location: "", dates: "", bullets: [""] },
    ],
    publications: [{ title: "", authors: "", doi: "", date: "" }],
    projects: [{ name: "", link: "", description: "", tools: "" }],
    technologies: { languages: "", tools: "" },
  });
  const [showResume, setShowResume] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const resumeRef = useRef();

  const handleInputChange = (section, index, field, value) => {
    setFormData((prev) => {
      if (index !== undefined && index !== null) {
        return {
          ...prev,
          [section]: prev[section].map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
          ),
        };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
  };

  const addEntry = (section) => {
    setFormData((prev) => {
      const newEntry = {
        education: {
          institution: "",
          degree: "",
          dates: "",
          gpa: "",
          coursework: "",
        },
        experience: {
          position: "",
          company: "",
          location: "",
          dates: "",
          bullets: [""],
        },
        publications: { title: "", authors: "", doi: "", date: "" },
        projects: { name: "", link: "", description: "", tools: "" },
      }[section];

      return { ...prev, [section]: [...prev[section], newEntry] };
    });
  };

  const removeEntry = (section, index) => {
    setFormData((prev) => {
      if (prev[section].length === 1) return prev; // Don't remove the last entry
      return {
        ...prev,
        [section]: prev[section].filter((_, idx) => idx !== index),
      };
    });
  };

  const addBullet = (expIndex) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === expIndex ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    }));
  };

  const removeBullet = (expIndex, bulletIndex) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === expIndex
          ? {
              ...exp,
              bullets: exp.bullets.filter((_, bIdx) => bIdx !== bulletIndex),
            }
          : exp
      ),
    }));
  };

  const downloadPdf = async () => {
    if (!resumeRef.current) return;
    
    setIsGeneratingPdf(true);
    try {
      // Enhanced PDF generation with better error handling
      const canvas = await html2canvas(resumeRef.current, {
        useCORS: true,
        scale: 2, // Higher resolution for better quality
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Remove any unsupported CSS
          clonedDoc.querySelectorAll('*').forEach(node => {
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const v = node.style[prop];
              if (v && v.includes('oklch')) {
                node.style[prop] = ''; 
              }
            });
          });
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      
      // Check if content exceeds jsPDF's height limit (14400pt)
      if (pageHeight > 14400) {
        // Handle very long resumes by scaling down
        const ratio = 14400 / pageHeight;
        const scaledWidth = pageWidth * ratio;
        const scaledHeight = pageHeight * ratio;
        pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }
      
      pdf.save(`${formData.personalInfo.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Resume Generator</h1>
              <p className="text-blue-600">Create a professional resume in minutes</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <button 
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => setShowResume(false)}
              >
                Edit Resume
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => setShowResume(true)}
              >
                Preview Resume
              </button>
            </div>
          </div>

          {!showResume ? (
            <>
              <div className="bg-blue-50 rounded-lg p-2 flex flex-wrap gap-2 mb-6">
                {[
                  { id: "personal", label: "Personal Info" },
                  { id: "education", label: "Education" },
                  { id: "experience", label: "Experience" },
                  { id: "publications", label: "Publications" },
                  { id: "projects", label: "Projects" },
                  { id: "technologies", label: "Technologies" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? "bg-white text-purple-700 shadow-sm font-medium" 
                        : "text-blue-700 hover:bg-blue-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                {activeTab === "personal" && (
                  <div className="bg-white rounded-lg border border-blue-100 p-6">
                    <h3 className="text-xl text-blue-800 font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(formData.personalInfo).map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="text"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            value={formData.personalInfo[field]}
                            onChange={(e) =>
                              handleInputChange("personalInfo", null, field, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "education" && (
                  <SectionForm
                    title="Education"
                    entries={formData.education}
                    fields={[
                      { name: "institution", label: "Institution" },
                      { name: "degree", label: "Degree" },
                      { name: "dates", label: "Dates" },
                      { name: "gpa", label: "GPA" },
                      { name: "coursework", label: "Relevant Coursework" }
                    ]}
                    onChange={(index, field, value) =>
                      handleInputChange("education", index, field, value)
                    }
                    onAdd={() => addEntry("education")}
                    onRemove={removeEntry}
                  />
                )}

                {activeTab === "experience" && (
                  <SectionForm
                    title="Experience"
                    entries={formData.experience}
                    fields={[
                      { name: "position", label: "Position" },
                      { name: "company", label: "Company" },
                      { name: "location", label: "Location" },
                      { name: "dates", label: "Dates" }
                    ]}
                    onChange={(index, field, value) =>
                      handleInputChange("experience", index, field, value)
                    }
                    onAdd={() => addEntry("experience")}
                    onRemove={removeEntry}
                    onAddBullet={addBullet}
                    onRemoveBullet={removeBullet}
                    hasBullets={true}
                  />
                )}

                {activeTab === "publications" && (
                  <SectionForm
                    title="Publications"
                    entries={formData.publications}
                    fields={[
                      { name: "title", label: "Title" },
                      { name: "authors", label: "Authors" },
                      { name: "doi", label: "DOI" },
                      { name: "date", label: "Date" }
                    ]}
                    onChange={(index, field, value) =>
                      handleInputChange("publications", index, field, value)
                    }
                    onAdd={() => addEntry("publications")}
                    onRemove={removeEntry}
                  />
                )}

                {activeTab === "projects" && (
                  <SectionForm
                    title="Projects"
                    entries={formData.projects}
                    fields={[
                      { name: "name", label: "Project Name" },
                      { name: "link", label: "Project Link" },
                      { name: "description", label: "Description" },
                      { name: "tools", label: "Tools Used" }
                    ]}
                    onChange={(index, field, value) =>
                      handleInputChange("projects", index, field, value)
                    }
                    onAdd={() => addEntry("projects")}
                    onRemove={removeEntry}
                  />
                )}

                {activeTab === "technologies" && (
                  <div className="bg-white rounded-lg border border-blue-100 p-6">
                    <h3 className="text-xl text-blue-800 font-semibold mb-4">Technologies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Languages
                        </label>
                        <textarea
                          placeholder="List programming languages you know (e.g., JavaScript, Python, Java)"
                          className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent h-32"
                          value={formData.technologies.languages}
                          onChange={(e) =>
                            handleInputChange(
                              "technologies",
                              null,
                              "languages",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Tools & Frameworks
                        </label>
                        <textarea
                          placeholder="List tools, frameworks, and technologies (e.g., React, Node.js, Git)"
                          className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent h-32"
                          value={formData.technologies.tools}
                          onChange={(e) =>
                            handleInputChange(
                              "technologies",
                              null,
                              "tools",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-8">
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <ResumeTemplate data={formData} ref={resumeRef} />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={downloadPdf}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download as PDF
                    </>
                  )}
                </button>
                <button
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setShowResume(false)}
                >
                  Edit Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionForm = ({
  title,
  entries,
  fields,
  onChange,
  onAdd,
  onRemove,
  onAddBullet,
  onRemoveBullet,
  hasBullets = false
}) => {
  return (
    <div className="bg-white rounded-lg border border-blue-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl text-blue-800 font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => onAdd(title.toLowerCase())}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>
      </div>

      {entries.map((entry, index) => (
        <div key={index} className="mb-6 border-l-4 border-purple-200 pl-4 bg-blue-50 p-4 rounded-lg relative">
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(title.toLowerCase(), index)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.label}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={entry[field.name]}
                  onChange={(e) => onChange(index, field.name, e.target.value)}
                />
              </div>
            ))}
          </div>

          {hasBullets && (
            <div className="ml-4 mt-4">
              <label className="block text-sm font-medium text-blue-700 mb-2">Bullet Points</label>
              {entry.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-center mb-2">
                  <span className="text-blue-500 mr-2">•</span>
                  <input
                    type="text"
                    placeholder={`Bullet point ${bulletIndex + 1}`}
                    className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = entry.bullets.map((b, i) =>
                        i === bulletIndex ? e.target.value : b
                      );
                      onChange(index, "bullets", newBullets);
                    }}
                  />
                  {entry.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveBullet(index, bulletIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAddBullet(index)}
                className="text-blue-600 text-sm hover:text-blue-800 mt-2 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Bullet Point
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GenerateResume;