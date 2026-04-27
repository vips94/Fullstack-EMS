import { Router } from "express";
import {
  createLeave,
  getLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { portectAdmin, protect } from "../middleware/auth.js";

const leaveRoutes = Router();

leaveRoutes.get("/", protect, getLeaves);
leaveRoutes.post("/", protect, createLeave);
leaveRoutes.patch("/:id", protect, portectAdmin, updateLeaveStatus);

export default leaveRoutes;
