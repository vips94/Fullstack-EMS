import {Router} from "express";
import { clockInOut, getAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const attendanceRoute = Router();

attendanceRoute.post("/", protect, clockInOut);
attendanceRoute.get("/", protect, getAttendance);

export default attendanceRoute;