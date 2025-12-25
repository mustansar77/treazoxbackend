import bcrypt from "bcryptjs";
import User from "../models/User.js";

const initializeAdmin = async () => {
  try {
    const adminEmail = "admin@example.com"; // change as needed
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      return; // just return, don't exit process
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      fullName: "Admin User",
      email: adminEmail,
      phone: "+920000000000",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:", admin.email);
  } catch (err) {
    console.error("Error initializing admin:", err);
  }
};

export default initializeAdmin;
