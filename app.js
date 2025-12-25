import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import initializeAdmin from "./config/initAdmin.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
await connectDB(); // Make sure database connects before starting server

const app = express();

// ✅ CORS Config
const corsOptions = {
  origin: ["https://treazox1.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/users", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Treazox Backend is running 🚀",
  });
});

// ✅ Catch-all for unsupported methods on API routes
app.use("/api", (req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  next();
});
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeAdmin();
});
