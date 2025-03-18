const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password: password });
    await user.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).send({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    console.log(user.password);
    console.log(password);

    const isMatch = await bcrypt.compare(password, user.password); //await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.send({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).send({ error: "Login failed" });
  }
};

const logout = (req, res) => {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "strict",
    });
    res.send({ message: "Logged out successfully" });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Validate the new password
  if (!password || password.length < 6) {
    return res
      .status(400)
      .send({ error: "Password must be at least 6 characters long" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is for password reset
    // if (decoded.purpose !== 'password-reset') {
    //  return res.status(400).send({ error: "Invalid token" });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Update the user's password
    const user = await User.findByIdAndUpdate(
      decoded._id,
      { password: hashedPassword },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Invalidate the token (optional)
    // user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();

    // Send success response
    res.send({ message: "Password has been reset successfully." });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).send({ error: "Token has expired" });
    }
    res.status(400).send({ error: "Invalid or expired token" });
  }
};

// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded._id);
//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }

//     const pWorld = await bcrypt.hash(password, 8);
//     user.password = pWorld;
//     await user.save();
//     res.send({ message: "Password has been reset successfully." });
//   } catch (err) {
//     res.status(400).send({ error: "Invalid or expired token" });
//   }
// };

// Function to send email
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });
  console.log(transporter);
  const resetLink = `http://localhost:3001/reset-password/${token}`; // Adjust the URL as needed
  console.log(resetLink);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetLink}`,
  };
  console.log(mailOptions);
  await transporter.sendMail(mailOptions);
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
 
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
 
    await sendResetEmail(email, token);
    res.send({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).send({ error: "Failed to send reset email" });
  }
};
module.exports = { signup, login, logout, requestPasswordReset , resetPassword};
