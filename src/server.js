require("dotenv").config();
const express = require("express");
const { default: connectDB } = require("./config/db");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Middleware
 */
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
