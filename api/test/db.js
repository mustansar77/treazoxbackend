import connectDB from "../../config/database.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    res.status(200).json({ message: "DB connected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
