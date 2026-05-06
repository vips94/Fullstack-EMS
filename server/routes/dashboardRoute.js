/**
 * Dashboard Route - Role-specific dashboard data
 * 
 * protect middleware - JWT verification required
 */

import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";

const dashboardRouter = Router();

/**
 * GET /api/dashboard
 * Middleware: protect (JWT verification required)
 * Response (Admin): { role: "ADMIN", totalEmployees, totalAttendance, pendingLeaves, totalDepartments }
 * Response (Employee): { role: "EMPLOYEE", employee, currentMonthAttendance, pendingLeaves, latestPayslip }
 * Description: Returns role-specific dashboard statistics and metrics
 */
dashboardRouter.get("/", protect, getDashboard);

export default dashboardRouter;
