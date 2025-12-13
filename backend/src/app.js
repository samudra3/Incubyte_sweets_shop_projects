const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const sweetsRoutes = require("./modules/sweets/sweets.routes");
const cors= require('cors');

const { authenticate } = require("./middlewares/auth.middleware");
const app = express();
app.use(cors('*'));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

//Temporary route for middleware Testing
app.get("/api/protected-test", authenticate, (req, res) => {
      res.status(200).json({ message: "Access granted" });
    });

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Sweet Shop API is running" });
});

module.exports = app;
