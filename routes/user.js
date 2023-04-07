const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Create User
router.post("/", userController.createUser);

// Generate OTP
router.post("/generateOTP", userController.generateOTP);

// Verify OTP
router.get("/:user_id/verifyOTP", userController.verifyOTP);

module.exports = router;
