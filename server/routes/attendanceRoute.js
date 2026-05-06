/**
 * Attendance Routes - Employee check-in/out operations
 * 
 * protect middleware - JWT verification required for all routes
 * Allows employees to track their work hours
 */

import {Router} from "express";
import { clockInOut, getAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const attendanceRoute = Router();

/**
 * POST /api/attendance
 * Middleware: protect (JWT verification required)
 * Request: {}  (no body required - uses authenticated user)
 * Response: { success: true, data: attendance }
 * Description: Toggles check-in/check-out for employee, calculates working hours
 */
attendanceRoute.post("/", protect, clockInOut);

/**
 * GET /api/attendance
 * Middleware: protect (JWT verification required)
 * Query params: ?limit=30 (optional pagination limit)
 * Response: { success: true, data: [attendance records] }
 * Description: Retrieves authenticated employee's attendance history
 */
attendanceRoute.get("/", protect, getAttendance);

export default attendanceRoute;