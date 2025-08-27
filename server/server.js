



// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data"); // used for proxying files to python microservice

// Models
const User = require("./models/User");
const UG = require("./models/UG");
const HSC_Diploma = require("./models/HSC_Diploma");
const SSC = require("./models/SSC");
const VisibilityFlags = require("./models/VisibilityFlags");
const SkillCertificate = require("./models/SkillCertificate");

// Controllers
const certNotifyController = require("./controllers/certNotifyController");

// Multer storage (files will be stored in server/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const UPLOAD_DIR = path.join(__dirname, "uploads");
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve uploaded files (make sure path matches multer destination)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mongoose connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Attach native mongo db handle to express app when ready so controllers can use it
mongoose.connection.once("open", () => {
  app.set("mongoDb", mongoose.connection.db);
  console.log("Native MongoDB handle set on express app as 'mongoDb'");
});

// Basic root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===================== AUTH & USER ROUTES =====================

// Register route
app.post("/api/register", async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    age,
    dob,
    address,
    about,
    phoneNumber,
    postalCode,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !age ||
    !dob ||
    !address ||
    !phoneNumber ||
    !postalCode
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      dob,
      address,
      about,
      phoneNumber,
      postalCode,
    });

    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user data route
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...userData } = user._doc;
    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===================== OTP Email =====================

let otpStorage = {}; // simple in-memory OTP store for dev

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "sdbcontactme@gmail.com",
    pass: process.env.EMAIL_PASS || "fywacjgevdugsgtz",
  },
});

app.post("/api/send-email", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  try {
    const templatePath = path.join(__dirname, "templates", "otp-template.html");
    let htmlContent = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf8") : `<p>Your OTP: {{otp}}</p>`;
    htmlContent = htmlContent.replace(/{{otp}}/g, otp).replace(/{{email}}/g, email);

    const mailOptions = {
      from: `"TalentSync Sol" <${process.env.EMAIL_USER || "sdbcontactme@gmail.com"}>`,
      to: email,
      subject: "Your Verification Code for TalentSync Sol",
      text: `Your OTP for verification is: ${otp}\nThis code will expire in 10 minutes.`,
      html: htmlContent,
    };

    if (otpStorage[email] && otpStorage[email].expiry > Date.now()) {
      return res.status(200).json({ success: true, message: "OTP already sent. Please check your email." });
    }

    await transporter.sendMail(mailOptions);

    otpStorage[email] = { otp, expiry: otpExpiry };

    setTimeout(() => {
      if (otpStorage[email] && otpStorage[email].expiry <= Date.now()) {
        delete otpStorage[email];
      }
    }, 10 * 60 * 1000);

    res.status(200).json({ success: true, message: "OTP sent successfully", otp: process.env.NODE_ENV === "development" ? otp : undefined });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  const { email, enteredOtp } = req.body;

  if (!otpStorage[email]) {
    return res.status(400).json({ success: false, message: "No OTP requested for this email" });
  }

  if (otpStorage[email].expiry < Date.now()) {
    delete otpStorage[email];
    return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
  }

  if (otpStorage[email].otp !== enteredOtp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStorage[email];
  res.status(200).json({ success: true, message: "OTP verified successfully" });
});

// Duplicate check
app.post("/api/check-duplicate", async (req, res) => {
  const { username, email } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===================== EDUCATION / UPLOAD endpoints =====================

// UG route (uses multer single upload "transcriptFile")
app.post("/api/ug", upload.single("transcriptFile"), async (req, res) => {
  const {
    username,
    srn,
    prn,
    universityurl,
    university,
    course,
    startDate,
    graduateDate,
    cgp,
    state,
    district,
  } = req.body;

  try {
    let extractedText = null;

    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);

      try {
        const {
          data: { text },
        } = await Tesseract.recognize(filePath, "eng");
        extractedText = text;
        console.log("OCR Extracted Text:", extractedText);

        fs.unlinkSync(filePath);
      } catch (ocrError) {
        console.error("OCR Error:", ocrError);
        return res.status(500).json({ success: false, message: "Error processing transcript with OCR" });
      }
    }

    const newUG = new UG({
      username,
      srn,
      prn,
      universityurl,
      university,
      course,
      startDate: startDate ? new Date(startDate) : null,
      graduateDate: graduateDate ? new Date(graduateDate) : null,
      cgp,
      state,
      district,
      transcriptFile: req.file ? req.file.filename : null,
    });

    if (extractedText) {
      newUG.university = extractedText.match(/University:\s*(.*)/)?.[1] || university;
      newUG.course = extractedText.match(/Course:\s*(.*)/)?.[1] || course;
    }

    await newUG.save();
    res.status(201).json({ success: true, message: "UG form data saved successfully!", extractedText });
  } catch (error) {
    console.error("Error saving UG form data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// HSC Diploma submission (no file in this handler; can be extended similarly)
app.post("/api/hsc", async (req, res) => {
  try {
    const {
      username,
      hcn,
      collage,
      course_hsc_diploma,
      gap,
      board,
      startDate,
      graduateDate,
      totalMarks,
      obtainedMarks,
      percentage,
      state,
      district,
      subDistrict,
      transcriptFile,
    } = req.body;

    const newHscDiploma = new HSC_Diploma({
      username,
      hcn,
      collage,
      course_hsc_diploma,
      gap,
      board,
      startDate,
      graduateDate,
      totalMarks,
      obtainedMarks,
      percentage,
      state,
      district,
      subDistrict,
      transcriptFile,
    });

    const savedHscDiploma = await newHscDiploma.save();

    res.status(201).json({ success: true, message: "HSC Diploma data saved successfully", data: savedHscDiploma });
  } catch (error) {
    console.error("Error saving HSC Diploma data:", error);
    res.status(500).json({ success: false, message: "Error saving HSC Diploma data", error: error.message });
  }
});

// SSC submission
app.post("/api/ssc", async (req, res) => {
  try {
    const {
      username,
      esn,
      institution,
      board,
      course,
      yearOfPassing,
      totalMarks,
      obtainedMarks,
      percentage,
      state,
      district,
      subDistrict,
      transcriptFile,
    } = req.body;

    const newSSC = new SSC({
      username,
      esn,
      institution,
      board,
      course,
      yearOfPassing,
      totalMarks,
      obtainedMarks,
      percentage,
      state,
      district,
      subDistrict,
      transcriptFile,
    });

    const savedSSC = await newSSC.save();

    res.status(201).json({ success: true, message: "SSC data saved successfully", data: savedSSC });
  } catch (error) {
    console.error("Error saving SSC data:", error);
    res.status(500).json({ success: false, message: "SSC save error", error: error.message });
  }
});

// Visibility flags
app.put("/api/visibility/:username", async (req, res) => {
  const { username } = req.params;
  const { ugSubmitted, hscSubmitted, sscSubmitted } = req.body;

  try {
    const result = await VisibilityFlags.findOneAndUpdate(
      { username },
      { ugSubmitted, hscSubmitted, sscSubmitted },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/visibility/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const flags = await VisibilityFlags.findOne({ username });
    if (!flags) {
      return res.status(200).json({
        success: true,
        data: {
          ugSubmitted: false,
          hscSubmitted: false,
          sscSubmitted: false,
        },
      });
    }
    return res.status(200).json({ success: true, data: flags });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===================== ATS + Gemini Resume endpoint =====================

app.get("/api/resume", (req, res) => {
  const resumePath = path.join(__dirname, "sample-resume.pdf");
  res.download(resumePath, "resume.pdf");
});

app.post("/api/calculate-ats", upload.single("resume"), async (req, res) => {
  const { jobTitle } = req.body;
  const file = req.file;
  if (!file || !jobTitle) {
    return res.status(400).json({ success: false, message: "Missing resume file or job title" });
  }

  let text = "";
  try {
    const buffer = fs.readFileSync(file.path);
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }
  } catch (e) {
    console.error("Parsing error:", e);
    return res.status(500).json({ success: false, message: "Error processing resume file" });
  } finally {
    try { fs.unlinkSync(file.path); } catch (e) {/* ignore */ }
  }

  const score = calculateATSScore(text, jobTitle);

  let suggestions = "";
  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this resume for ATS optimization and provide suggestions for a ${jobTitle} role:\n\n${text}`,
              },
            ],
          },
        ],
      }
    );
    suggestions =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions generated";
  } catch (e) {
    console.error("Gemini error:", e.response?.data || e.message);
    suggestions = "Failed to generate suggestions at this time.";
  }

  return res.json({ success: true, score, suggestions });
});

function calculateATSScore(text, jobTitle) {
  const criteria = {
    contactInfo: 15,
    education: 20,
    experience: 25,
    skills: 20,
    keywords: 20,
  };
  let score = 0;
  if (/(phone|email|address)/gi.test(text)) score += criteria.contactInfo;
  if (/(education|academic background|qualifications)/gi.test(text)) score += criteria.education;
  if (/(experience|work history|employment)/gi.test(text)) score += criteria.experience;
  if (/(skills|technical skills|competencies)/gi.test(text)) score += criteria.skills;

  const keywords = getJobKeywords(jobTitle);
  const found = keywords.filter((kw) => new RegExp(kw, "gi").test(text));
  score += (found.length / keywords.length) * criteria.keywords;
  return Math.min(100, Math.round(score));
}

function getJobKeywords(jobTitle) {
  const map = {
    sde: ["programming", "algorithms", "data structures", "software development"],
    pe: ["project management", "team leadership", "budgeting"],
    pse: ["system design", "architecture", "scalability"],
    "full stack developer": ["frontend", "backend", "database", "api", "react", "node.js"],
  };
  return map[jobTitle?.toLowerCase()] || ["communication", "problem solving", "teamwork"];
}

// ===================== NEW: Certificate Integration Routes =====================

// 1) Python microservice will POST parsed data here after processing
// Make sure to protect this route with a shared secret in production (see security checklist)
app.post("/api/certs/notify", express.json(), certNotifyController.notify);

// 2) Proxy upload route: accept file from frontend and forward to Python microservice
// This is optional — use direct upload or proxy depending on network/setup
app.post("/api/upload_cert_proxy", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const PYTHON_URL = process.env.PYTHON_UPLOAD_URL || "http://localhost:5001/api/upload_cert"; // change in prod to python service address
    const form = new FormData();
    const userId = req.body.user_id || req.body.userId || req.body.username || req.body.username;
    if (userId) form.append("user_id", userId);

    // Append file stream
    form.append("file", fs.createReadStream(path.join(__dirname, req.file.path)), req.file.originalname);

    const headers = {
      ...form.getHeaders(),
      // forward auth header if present
      ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
    };

    const response = await axios.post(PYTHON_URL, form, {
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000,
    });

    // Optionally delete the file after proxying
    try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("upload_cert_proxy error:", err.message || err);
    return res.status(500).json({ success: false, message: err.message || "Proxy error" });
  }
});

// 3) Fetch parse JSON by parse_id (used by frontend polling to fetch parsed result)
app.get("/api/parse/:parse_id", async (req, res) => {
  try {
    const parseId = req.params.parse_id;
    const db = req.app.get("mongoDb");
    if (!db) return res.status(500).json({ success: false, message: "MongoDB not ready" });

    const parseDoc = await db.collection("parses").findOne({ _id: parseId });
    if (!parseDoc) {
      // fallback: try to find in SkillCertificate collection in case Node saved it
      const sc = await SkillCertificate.findOne({ "parsed.parse_id": parseId }).lean();
      if (sc) return res.json({ success: true, parse: sc.parsed });
      return res.status(404).json({ success: false, message: "Parse not found" });
    }

    return res.json({ success: true, parse: parseDoc });
  } catch (err) {
    console.error("Error fetching parse:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ===================== START SERVER =====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
