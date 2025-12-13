const express = require("express");
const { createSweet } = require("./sweets.controller");
const {
  authenticate,
  authorizeAdmin
} = require("../../middlewares/auth.middleware");

const router = express.Router();

// Admin-only: add sweet
router.post("/", authenticate, authorizeAdmin, createSweet);

module.exports = router;
