const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
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
    res.send({ message: "Logged in successfully" });
  } catch (err) {
    res.status(400).send({ error: "Login failed" });
  }
};
module.exports = { signup, login };
