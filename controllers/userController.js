import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already registered" });

    let referredBy = null;
    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (!refUser) return res.status(400).json({ message: "Invalid referral code" });
      referredBy = refUser._id;
    }

    // ✅ Let model hash password and generate referral code
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
      referredBy,
    });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // include password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // compare password using method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // hide password in response
    const { password: pwd, ...userData } = user._doc;

    res.json({
      message: "Login successful",
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
