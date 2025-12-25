import connectDB from "../../config/database.js";
import runCors from "../../lib/cors.js";
import { initAdmin } from "../../controllers/adminController.js";

export default async function handler(req, res) {
  await runCors(req, res);
  await connectDB();

  try {
    const data = await initAdmin();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
