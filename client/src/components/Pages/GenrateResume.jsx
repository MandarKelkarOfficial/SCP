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
    <div ref={ref} className="p-6 bg-white text-gray-900 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
      <p className="mb-4">
        {personalInfo.location} | {personalInfo.email} | {personalInfo.phone}
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold border-b border-gray-300 mb-2">
          Education
        </h2>
        {education.map((edu, i) => (
          <div key={i} className="mb-2">
            <p className="font-medium">
              {edu.degree}, {edu.institution}
            </p>
            <p className="text-sm text-gray-600">
              {edu.dates} | GPA: {edu.gpa}
            </p>
            <p className="text-sm">{edu.coursework}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold border-b border-gray-300 mb-2">
          Experience
        </h2>
        {experience.map((exp, i) => (
          <div key={i} className="mb-2">
            <p className="font-medium">
              {exp.position} @ {exp.company}
            </p>
            <p className="text-sm text-gray-600">
              {exp.dates} | {exp.location}
            </p>
            <ul className="list-disc list-inside">
              {exp.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold border-b border-gray-300 mb-2">
          Publications
        </h2>
        {publications.map((pub, i) => (
          <div key={i} className="mb-2">
            <p className="font-medium">{pub.title}</p>
            <p className="text-sm text-gray-600">{pub.authors}</p>
            <p className="text-sm">
              {pub.doi && <>DOI: {pub.doi} | </>}
              {pub.date}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold border-b border-gray-300 mb-2">
          Projects
        </h2>
        {projects.map((proj, i) => (
          <div key={i} className="mb-2">
            <p className="font-medium">
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
              <p className="text-sm text-gray-600">Tools: {proj.tools}</p>
            )}
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold border-b border-gray-300 mb-2">
          Technologies
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-1">Languages</h3>
            <p className="text-sm">{technologies.languages}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Tools & Frameworks</h3>
            <p className="text-sm">{technologies.tools}</p>
          </div>
        </div>
      </section>
    </div>
  );
});

const GenerateResume = () => {
  // ... existing state and handlers ...

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
  const resumeRef = useRef();

  const handleInputChange = (section, index, field, value) => {
    setFormData((prev) => {
      // avoid deep JSON clone; use spread and map
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

  // Update the addEntry function to handle all section types
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

  const addBullet = (expIndex) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === expIndex ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    }));
  };

  // const downloadPdf = () => {
  //   if (!resumeRef.current) return;
  //   html2canvas(resumeRef.current).then((canvas) => {
  //     const img = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "pt", "a4");
  //     const width = pdf.internal.pageSize.getWidth();
  //     const height = (canvas.height * width) / canvas.width;
  //     pdf.addImage(img, "PNG", 0, 0, width, height);
  //     pdf.save("resume.pdf");
  //   });
  // };

    const downloadPdf = () => {
    if (!resumeRef.current) return;

    html2canvas(resumeRef.current, {
      // Remove any unsupported oklch() colors before rendering
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('*').forEach(node => {
          ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
            const v = node.style[prop];
            if (v && v.includes('oklch')) {
              node.style[prop] = ''; 
            }
          });
        });
      }
    }).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('resume.pdf');
    }).catch(err => {
      console.error('Error generating PDF:', err);
    });
  };


  // Add input sections for new categories in the form
  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* ... existing personal info section ... */}
        <h2 className="text-3xl font-bold text-purple-800 mb-6">
          Resume Generator{" "}
        </h2>

        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl text-purple-700 font-semibold mb-4">
            Personal Information
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData.personalInfo).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
                value={formData.personalInfo[field]}
                onChange={(e) =>
                  handleInputChange("personalInfo", null, field, e.target.value)
                }
              />
            ))}
          </div>
        </div>

        {/* Education Section */}
        <SectionForm
          title="Education"
          entries={formData.education}
          fields={["institution", "degree", "dates", "gpa", "coursework"]}
          onChange={(index, field, value) =>
            handleInputChange("education", index, field, value)
          }
          onAdd={() => addEntry("education")}
        />

        {/* Experience Section */}
        <SectionForm
          title="Experience"
          entries={formData.experience}
          fields={["position", "company", "location", "dates"]}
          onChange={(index, field, value) =>
            handleInputChange("experience", index, field, value)
          }
          onAdd={() => addEntry("experience")}
          onAddBullet={addBullet}
        />

        {/* Publications Section */}
        <SectionForm
          title="Publications"
          entries={formData.publications}
          fields={["title", "authors", "doi", "date"]}
          onChange={(index, field, value) =>
            handleInputChange("publications", index, field, value)
          }
          onAdd={() => addEntry("publications")}
        />

        {/* Projects Section */}
        <SectionForm
          title="Projects"
          entries={formData.projects}
          fields={["name", "link", "description", "tools"]}
          onChange={(index, field, value) =>
            handleInputChange("projects", index, field, value)
          }
          onAdd={() => addEntry("projects")}
        />

        {/* Technologies Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl text-purple-700 font-semibold mb-4">
            Technologies
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Languages"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
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
              <input
                type="text"
                placeholder="Tools & Frameworks"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
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

        {/* ... rest of the component ... */}

        <button
          className="w-full bg-purple-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-900"
          onClick={() => setShowResume(true)}
        >
          Generate Resume
        </button>

        {showResume && (
          <>
            <div className="mt-8">
              <ResumeTemplate data={formData} ref={resumeRef} />
            </div>
            <div className="flex items-center justify-center">
         
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-75"
                onClick={downloadPdf}
              >
                Download as PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper component for repeated section forms
const SectionForm = ({
  title,
  entries,
  fields,
  onChange,
  onAdd,
  onAddBullet,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-purple-700 font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="bg-purple-200 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-300"
        >
          Add Entry
        </button>
      </div>

      {entries.map((entry, index) => (
        <div key={index} className="mb-4 border-l-4 border-purple-200 pl-4">
          {fields.map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-2 mb-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
              value={entry[field]}
              onChange={(e) => onChange(index, field, e.target.value)}
            />
          ))}

          {title === "Experience" && (
            <div className="ml-4">
              {entry.bullets.map((bullet, bulletIndex) => (
                <input
                  key={bulletIndex}
                  type="text"
                  placeholder={`Bullet point ${bulletIndex + 1}`}
                  className="w-full p-2 mb-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
                  value={bullet}
                  onChange={(e) => {
                    const newBullets = entry.bullets.map((b, i) =>
                      i === bulletIndex ? e.target.value : b
                    );
                    onChange(index, "bullets", newBullets);
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => onAddBullet(index)}
                className="text-purple-800 text-sm hover:underline"
              >
                + Add Bullet Point
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GenerateResume;
