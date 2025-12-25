import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req) => {
  const { fullName, email, phone, password, referralCode } = req.body;
  if (!fullName || !email || !phone || !password) throw new Error("All fields required");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already exists");

  let referredUser = null;
  if (referralCode) referredUser = await User.findOne({ referralCode });

  const user = new User({ fullName, email, phone, password, referredBy: referredUser?._id || null });
  user.referralCode = user.generateReferralCode();
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token };
};

export const login = async (req) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token, role: user.role };
};
