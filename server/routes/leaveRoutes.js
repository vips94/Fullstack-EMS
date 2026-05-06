/**
 * Leave Routes - Leave request management
 * 
 * protect middleware - JWT verification required
 * portectAdmin middleware - Role verification (admin only for approval)
 */

import { Router } from "express";
import {
  createLeave,
  getLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { portectAdmin, protect } from "../middleware/auth.js";

const leaveRoutes = Router();

/**
 * GET /api/leaves
 * Middleware: protect (JWT verification required)
 * Query params: ?status=PENDING (optional status filter)
 * Response: { success: true, data: [leaves] }
 * Description: 
 * - Admin: Returns all leave requests (filterable by status)
 * - Employee: Returns only their own leave requests
 */
leaveRoutes.get("/", protect, getLeaves);

/**
 * POST /api/leaves
 * Middleware: protect (JWT verification required)
 * Request: { startDate, endDate, type, reason }
 * Response: { success: true, data: leave }
 * Description: Employee submits new leave request (future dates only)
 */
leaveRoutes.post("/", protect, createLeave);

/**
 * PATCH /api/leaves/:id
 * Middleware: protect, portectAdmin (admin required)
 * Params: id (leave application ID)
 * Request: { status: "APPROVED" or "REJECTED" }
 * Response: { success: true, data: updatedLeave }
 * Description: Admin approves or rejects leave request
 */
leaveRoutes.patch("/:id", protect, portectAdmin, updateLeaveStatus);

export default leaveRoutes;
