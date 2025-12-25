import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Not authorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");

  return user;
};

export const adminOnly = async (req, res) => {
  const user = await protect(req, res);
  if (user.role !== "admin") throw new Error("Admin access only");
  return user;
};
