require("dotenv").config();
const express = require("express");
const { default: connectDB } = require("./config/db");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Middleware
 */
// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
routes(app);

app.get("/", (req, res) => {
  res.send("SimpleQuiz API is running");
});

/**
 * MongoDB connection
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
