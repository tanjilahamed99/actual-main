const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 6000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://103.243.232.236:130"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Database
const connectDB = require("./src/db/db");
connectDB();

// All routes come from one place
const routes = require("./src/routes");
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "welcome to the API" });
});

// Central error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
