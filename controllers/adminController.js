import User from "../models/User.js";

export const initAdmin = async () => {
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) throw new Error("Admin already exists");

  const admin = new User({
    fullName: "Super Admin",
    email: process.env.ADMIN_EMAIL,
    phone: "0000000000",
    password: process.env.ADMIN_PASSWORD,
    role: "admin"
  });

  admin.referralCode = admin.generateReferralCode();
  await admin.save();
  return { message: "Admin created successfully" };
};
