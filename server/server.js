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

const User = require("./models/User");
const UG = require("./models/UG");
const HSC_Diploma = require("./models/HSC_Diploma");
const SSC = require("./models/SSC");
const VisibilityFlags = require("./models/VisibilityFlags");




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
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





// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));

// Replace mongoose.connect section
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB connection
// mongoose.connect("mongodb://localhost:27017/sihDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


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

  // Validate input
  // eslint-disable-next-line no-undef
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
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
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
      // Duplicate key error (username or email)
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Simulate session or token (for now)
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Exclude the password field from the response
    const { password, ...userData } = user._doc; // _doc gives you access to the actual document
    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Temporary storage for OTP (in a production app, consider a more persistent storage)
let otpStorage = {}; // e.g., { userEmail: generatedOtp }

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sdbcontactme@gmail.com",
    pass: "fywacjgevdugsgtz",
  },
});

// Email sending route (after user registration)

app.post("/api/send-email", async (req, res) => {
  const { email } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  try {
    // Read the HTML template file
    const templatePath = path.join(__dirname, "templates", "otp-template.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders in the template
    htmlContent = htmlContent
      .replace(/{{otp}}/g, otp)
      .replace(/{{email}}/g, email);

    const mailOptions = {
      from: '"TalentSync Sol" <sdbcontactme@gmail.com>', // Sender name and address
      to: email,
      subject: "Your Verification Code for TalentSync Sol", // Subject line
      text: `Your OTP for verification is: ${otp}\nThis code will expire in 10 minutes.`, // Plain text fallback
      html: htmlContent, // HTML body
    };

    // Check if OTP already exists for the email
    if (otpStorage[email] && otpStorage[email].expiry > Date.now()) {
      return res.status(200).json({
        success: true,
        message: "OTP already sent. Please check your email.",
      });
    }

    await transporter.sendMail(mailOptions);

    // Save OTP to storage with expiry time
    otpStorage[email] = {
      otp,
      expiry: otpExpiry,
    };

    // Schedule cleanup of expired OTP (optional)
    setTimeout(() => {
      if (otpStorage[email] && otpStorage[email].expiry <= Date.now()) {
        delete otpStorage[email];
      }
    }, 10 * 60 * 1000);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // Don't send OTP in production response - only for development
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// OTP Verification route

app.post("/api/verify-otp", async (req, res) => {
  const { email, enteredOtp } = req.body;

  if (!otpStorage[email]) {
    return res.status(400).json({
      success: false,
      message: "No OTP requested for this email",
    });
  }

  if (otpStorage[email].expiry < Date.now()) {
    delete otpStorage[email];
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (otpStorage[email].otp !== enteredOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // OTP is valid
  delete otpStorage[email];
  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

// server.js or routes/user.js
app.post("/api/check-duplicate", async (req, res) => {
  const { username, email } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res
          .status(409)
          .json({ success: false, message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


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

    // If a transcript file is uploaded, process it with OCR
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);

      try {
        // Perform OCR using Tesseract.js
        const {
          data: { text },
        } = await Tesseract.recognize(filePath, "eng");
        extractedText = text;
        console.log("OCR Extracted Text:", extractedText);

        // Optional: Clean up the uploaded file after processing
        fs.unlinkSync(filePath);
      } catch (ocrError) {
        console.error("OCR Error:", ocrError);
        return res
          .status(500)
          .json({
            success: false,
            message: "Error processing transcript with OCR",
          });
      }
    }

    // Create a new UG document
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
      transcriptFile: req.file ? req.file.filename : null, // Store the file name
    });

    // Optionally parse extractedText and populate schema fields
    if (extractedText) {
      newUG.university =
        extractedText.match(/University:\s*(.*)/)?.[1] || university;
      newUG.course = extractedText.match(/Course:\s*(.*)/)?.[1] || course;
      // Add more parsing logic as needed
    }

    // Save to the database
    await newUG.save();

    res
      .status(201)
      .json({
        success: true,
        message: "UG form data saved successfully!",
        extractedText,
      });
  } catch (error) {
    console.error("Error saving UG form data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// HSC Diploma submission endpoint
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

    // Create a new HSC Diploma document
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
      transcriptFile, // Assuming you're handling the file upload separately
    });

    // Save the document to the database
    const savedHscDiploma = await newHscDiploma.save();

    // Send response back
    res.status(201).json({
      success: true,
      message: "HSC Diploma data saved successfully",
      data: savedHscDiploma,
    });
  } catch (error) {
    console.error("Error saving HSC Diploma data:", error);
    res.status(500).json({
      success: false,
      message: "Error saving HSC Diploma data",
      error: error.message,
    });
  }
});



// SSC submission endpoint
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

    // Create a new SSC document
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
      transcriptFile, // Assuming you're handling the file upload separately
    });

    // Save the document to the database
    const savedSSC = await newSSC.save();

    // Send response back
    res.status(201).json({
      success: true,
      message: "SSC data saved successfully",
      data: savedSSC,
    });
  } catch (error) {
    console.error("Error saving SSC data:", error);
    res.status(500).json({
      success: false,
      message: "Error saving SSC data",
      error: error.message,
    });
  }
});



// Endpoint to update visibility flags
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

// Endpoint to get visibility flags
app.get("/api/visibility/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const flags = await VisibilityFlags.findOne({ username });

    if (!flags) {
      // If no flags exist for the user, return a default object
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

// =========================API & AI=====================================================================================================



// Stub: serve a sample resume for “Fetch from DB”
app.get("/api/resume", (req, res) => {
  const resumePath = path.join(__dirname, "sample-resume.pdf");
  res.download(resumePath, "resume.pdf");
});

// Main ATS + Gemini endpoint
app.post("/api/calculate-ats", upload.single("resume"), async (req, res) => {
  const { jobTitle } = req.body;
  const file = req.file;
  if (!file || !jobTitle) {
    return res
      .status(400)
      .json({ success: false, message: "Missing resume file or job title" });
  }

  // === 1. Extract text ===
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
    return res
      .status(500)
      .json({ success: false, message: "Error processing resume file" });
  } finally {
    fs.unlinkSync(file.path);
  }

  // === 2. Compute ATS score ===
  const score = calculateATSScore(text, jobTitle);

  // === 3. Call Gemini for suggestions ===
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
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No suggestions generated";
    console.log("Api Worked!!!");
  } catch (e) {
    console.error("Gemini error:", e.response?.data || e.message);
    suggestions = "Failed to generate suggestions at this time.";
  }

  return res.json({ success: true, score, suggestions });
});

// === Helper Functions ===

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
  if (/(education|academic background|qualifications)/gi.test(text))
    score += criteria.education;
  if (/(experience|work history|employment)/gi.test(text))
    score += criteria.experience;
  if (/(skills|technical skills|competencies)/gi.test(text))
    score += criteria.skills;

  const keywords = getJobKeywords(jobTitle);
  const found = keywords.filter((kw) => new RegExp(kw, "gi").test(text));
  score += (found.length / keywords.length) * criteria.keywords;
  return Math.min(100, Math.round(score));
}

function getJobKeywords(jobTitle) {
  const map = {
    sde: [
      "programming",
      "algorithms",
      "data structures",
      "software development",
    ],
    pe: ["project management", "team leadership", "budgeting"],
    pse: ["system design", "architecture", "scalability"],
    "full stack developer": [
      "frontend",
      "backend",
      "database",
      "api",
      "react",
      "node.js",
    ],
  };
  return (
    map[jobTitle.toLowerCase()] || [
      "communication",
      "problem solving",
      "teamwork",
    ]
  );
}



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
