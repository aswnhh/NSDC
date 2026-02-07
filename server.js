const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const connectDB = require("./db");
const Student = require("./Models/Student");
const Login = require("./Models/Login");

const app = express();
connectDB();

app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Show form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle registration
app.post("/register", upload.single("photo"), async (req, res) => {
  const { name, email, phone, gender, password } = req.body;

  // Save student
  const student = await Student.create({
    name,
    email,
    phone,
    gender,
    photo: req.file.filename
  });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save login
  await Login.create({
    email,
    password: hashedPassword,
    type: "student"
  });

  res.send("Student registered successfully");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check login table
  const login = await Login.findOne({ email });
  if (!login) {
    return res.send("Invalid email");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, login.password);
  if (!isMatch) {
    return res.send("Invalid password");
  }

  // Redirect to profile
  res.redirect(`/profile/${email}`);
});


app.get("/profile/:email", async (req, res) => {
  const student = await Student.findOne({ email: req.params.email });

  if (!student) {
    return res.send("Profile not found");
  }

  res.render("profile", { student });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

