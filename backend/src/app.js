const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Sweet Shop API is running" });
});

module.exports = app;
