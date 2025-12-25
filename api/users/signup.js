import connectDB from "../../../config/database.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";


connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

    

    const newUser = await User.create({
      fullName,
      email,
      phone,
      referredBy,
    });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
