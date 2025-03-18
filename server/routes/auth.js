// authRoutes.js
const express = require("express");
const { signup, login, logout, requestPasswordReset, resetPassword } = require("../controllers/authControllers");
const { validateSignup } = require("../middleware/validate");

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);


module.exports = router;
