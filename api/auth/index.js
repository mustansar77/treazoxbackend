import connectDB from "../../config/database.js";
import runCors from "../../lib/cors.js";
import { login, signup } from "../../controllers/authController.js";

export default async function handler(req, res) {
  await runCors(req, res);
  await connectDB();

  try {
    if (req.method === "POST" && req.query.type === "signup") {
      const data = await signup(req);
      return res.status(201).json(data);
    }

    if (req.method === "POST" && req.query.type === "login") {
      const data = await login(req);
      return res.status(200).json(data);
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
