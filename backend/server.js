const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysupersecretkey";
let users = [];

app.use(cors());
app.use(express.json());

// ================== MULTER SETUP ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// ================== UPLOAD ROUTE ==================
app.post("/upload", upload.single("image"), (req, res) => {
  console.log("POST /upload called");

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).send("No file uploaded");
  }

  const imagePath = path.join(__dirname, "uploads", req.file.filename);
  const scriptPath = path.join(__dirname, "..", "ai_model", "predict.py");

  console.log("Image path:", imagePath);

  exec(`python "${scriptPath}" "${imagePath}"`, (error, stdout, stderr) => {
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);

    if (error) {
      console.log("Exec error:", error);
      return res.status(500).send("AI analysis failed");
    }

    const prediction = stdout.trim();

    if (!prediction) {
      return res.status(500).send("No prediction returned");
    }

    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      prediction,
    });
  });
});

// ================== AUTH ROUTES ==================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
});

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Backend server running");
});

// ================== START SERVER ==================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});