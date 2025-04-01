const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
// const Tesseract = require("tesseract");
const app = express();
const fs = require('fs');
const multer = require("multer");
// const path = require("path");
const Tesseract = require("tesseract.js");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON data
app.use(bodyParser.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sihDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure unique usernames
  email: { type: String, required: true, unique: true }, // Ensure unique emails
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber:{ type:String, required: true},
  about: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  profileImage: { type: String },
});

// Create User model
const User = mongoose.model("User", userSchema);

// Register route
app.post("/api/register", async (req, res) => {
  const { username, email, password, firstName, lastName, age, dob, address, about,phoneNumber,postalCode } = req.body;

  // Validate input
  // eslint-disable-next-line no-undef
  if (!username || !email || !password || !firstName || !lastName || !age || !dob || !address|| !phoneNumber || !postalCode) {
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
      // Duplicate key error (username or email)
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
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
      return res.status(404).json({ success: false, message: "User not found" });
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

  // Check if OTP already exists for the email
  if (otpStorage[email]) {
    return res.status(200).json({
      success: true,
      message: "OTP already sent. Please check your email.",
    });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: "sdbcontactme@gmail.com", // Sender address
    to: email, // List of receivers
    subject: "OTP Verification for TalentSync Sol", // Subject line
    text: `Your OTP for verification is: ${otp}`, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    // Save OTP to temporary storage
    otpStorage[email] = otp;
    res.status(200).json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// OTP Verification route
app.post("/api/verify-otp", (req, res) => {
  const { email, enteredOtp } = req.body; // Get email and entered OTP from the request

  if (otpStorage[email] && otpStorage[email] === enteredOtp) {
    delete otpStorage[email]; // Clear OTP after verification
    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP, please try again." });
  }
});



// server.js or routes/user.js
app.post('/api/check-duplicate', async (req, res) => {
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



// ================================================================================================================================


// Academic Credentials Schema
// UG Schema
const ugSchema = new mongoose.Schema({
  username: { type: String }, // Reference to the user
  srn: { type: String },
  prn: { type: String },
  universityurl: { type: String },
  university: { type: String },
  course: { type: String },
  startDate: { type: Date },
  graduateDate: { type: Date },
  cgp: { type: String },
  state: { type: String },
  district: { type: String },
  transcriptFile: { type: String }, // File path for uploaded transcripts
});

// Create UG model
const UG = mongoose.model('UG', ugSchema);


// app.post('/api/ug', async (req, res) => {
//   const { username, srn, prn, universityurl, university, course, startDate, graduateDate, cgp, state, district } = req.body;
  
//   try {
//     // Create a new UG document
//     const newUG = new UG({
//       username,
//       srn,
//       prn,
//       universityurl,
//       university,
//       course,
//       startDate: startDate ? new Date(startDate) : null,
//       graduateDate: graduateDate ? new Date(graduateDate) : null,
//       cgp,
//       state,
//       district,
//       });

//     // Save to the database
//     await newUG.save();

//     res.status(201).json({ success: true, message: "UG form data saved successfully!" });
//   } catch (error) {
//     console.error('Error saving UG form data:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });


app.post('/api/ug', upload.single('transcriptFile'), async (req, res) => {
  const { username, srn, prn, universityurl, university, course, startDate, graduateDate, cgp, state, district } = req.body;

  try {
    let extractedText = null;

    // If a transcript file is uploaded, process it with OCR
    if (req.file) {
      const filePath = path.join(__dirname, req.file.path);

      try {
        // Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(filePath, "eng");
        extractedText = text;
        console.log("OCR Extracted Text:", extractedText);

        // Optional: Clean up the uploaded file after processing
        fs.unlinkSync(filePath);
      } catch (ocrError) {
        console.error("OCR Error:", ocrError);
        return res.status(500).json({ success: false, message: "Error processing transcript with OCR" });
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
      newUG.university = extractedText.match(/University:\s*(.*)/)?.[1] || university;
      newUG.course = extractedText.match(/Course:\s*(.*)/)?.[1] || course;
      // Add more parsing logic as needed
    }

    // Save to the database
    await newUG.save();

    res.status(201).json({ success: true, message: "UG form data saved successfully!", extractedText });
  } catch (error) {
    console.error("Error saving UG form data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// HSC_Diploma Schema
const hscDiplomaSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Reference to the user
  hcn: { type: String, required: true },
  collage: { type: String, required: true },
  course_hsc_diploma: { type: String, required: true },
  gap: { type: String, required: true },
  board: { type: String, required: true },
  startDate: { type: Date },
  graduateDate: { type: Date },
  totalMarks: { type: Number },
  obtainedMarks: { type: Number },
  percentage: { type: String },
  state: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  transcriptFile: { type: String }, // File path for uploaded transcripts
});

// Create HSC_Diploma model
const HSC_Diploma = mongoose.model('HSC_Diploma', hscDiplomaSchema);


// HSC Diploma submission endpoint
app.post('/api/hsc', async (req, res) => {
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
      transcriptFile
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
      transcriptFile // Assuming you're handling the file upload separately
    });

    // Save the document to the database
    const savedHscDiploma = await newHscDiploma.save();
    
    // Send response back
    res.status(201).json({
      success: true,
      message: 'HSC Diploma data saved successfully',
      data: savedHscDiploma,
    });
  } catch (error) {
    console.error('Error saving HSC Diploma data:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving HSC Diploma data',
      error: error.message,
    });
  }
});



// SSC Schema
const sscSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Reference to the user
  esn: { type: String, required: true },
  institution: { type: String, required: true },
  board: { type: String, required: true },
  course: { type: String, required: true },
  yearOfPassing: { type: Date, required: true },
  totalMarks: { type: Number },
  obtainedMarks: { type: Number },
  percentage: { type: String },
  state: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  transcriptFile: { type: String }, // File path for uploaded transcripts
});

// Create SSC model
const SSC = mongoose.model('SSC', sscSchema);





// SSC submission endpoint
app.post('/api/ssc', async (req, res) => {
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
      transcriptFile
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
      transcriptFile // Assuming you're handling the file upload separately
    });

    // Save the document to the database
    const savedSSC = await newSSC.save();
    
    // Send response back
    res.status(201).json({
      success: true,
      message: 'SSC data saved successfully',
      data: savedSSC,
    });
  } catch (error) {
    console.error('Error saving SSC data:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving SSC data',
      error: error.message,
    });
  }
});


// =======================================================================================================================================================

// Visibility Flags Schema
const visibilityFlagsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  ugSubmitted: { type: Boolean, default: false },
  hscSubmitted: { type: Boolean, default: false },
  sscSubmitted: { type: Boolean, default: false },
});

// Create Visibility Flags model
const VisibilityFlags = mongoose.model('VisibilityFlags', visibilityFlagsSchema);

module.exports = VisibilityFlags;

// Endpoint to update visibility flags
app.put('/api/visibility/:username', async (req, res) => {
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
app.get('/api/visibility/:username', async (req, res) => {
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




// Start the server
const PORT = process.env.PORT || 5000; // Allow port to be set by environment variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
