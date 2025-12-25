import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.put("/balance/:userId", authenticate, authorizeRoles("admin"), updateUserBalance);

export default router;
