const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables ONCE at the top
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", ""],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require("./src/db/db");
connectDB();

const authRoutes = require("./src/routes/authRoutes");
// const adminRoutes = require("./src/routes/adminRoutes");
const readingRoutes = require("./src/routes/readingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", readingRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "welcome to the API" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
