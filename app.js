const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const { initializeDefaults } = require("./config/initializers"); // your superadmin init

dotenv.config();

const startServer = async () => {
  try {
    await connectDB(); // Connect to DB first

    // Initialize superadmin before server starts
    await initializeDefaults();

    const app = express();

    const corsOptions = {
      origin: ['https://treazox1.vercel.app', "http://localhost:3000"]
    };
    app.use(cors(corsOptions));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/api/users", userRoutes);

    app.get("/", (req, res) => {
      res.json({ status: "ok", message: "Treazox Backend is running 🚀" });
    });

    app.use("/api", (req, res, next) => {
      const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
      if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ message: "Method Not Allowed" });
      }
      next();
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
