const express = require("express");
const { register,login } = require("./auth.controller");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);
module.exports = router;
