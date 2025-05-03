const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Auth Routes
router.get("/register", authController.getRegister); // Shows tenant/owner card selection
router.post("/register", authController.postRegister); // Handles user creation

router.get("/login", authController.getLogin); // Shows login form
router.post("/login", authController.postLogin); // Logs in user → Redirects to dashboard or /role

router.get("/logout", authController.logout); // Logs out user

module.exports = router;
