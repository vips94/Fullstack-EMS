import {Router} from "express";
import { clockInOut, getAttendance } from "../controllers/attendanceController";
import { protect } from "../middleware/auth";

const attendanceRoute = Router();

attendanceRoute.post("/", protect, clockInOut);
attendanceRoute.get("/", protect, getAttendance);

export default attendanceRoute;