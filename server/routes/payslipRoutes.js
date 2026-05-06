/**
 * Payslip Routes - Payroll and payslip management
 * 
 * protect middleware - JWT verification required
 * portectAdmin middleware - Role verification (admin only for creation)
 */

import { Router } from "express";
import { createPayslip, getPayslipById, getPayslips } from "../controllers/payslipController.js";
import { portectAdmin, protect } from "../middleware/auth.js";

const payslipRouter = Router();

/**
 * GET /api/payslips
 * Middleware: protect (JWT verification required)
 * Response: { success: true, data: [payslips] }
 * Description: 
 * - Admin: Returns all payslips
 * - Employee: Returns only their own payslips
 */
payslipRouter.get("/", protect, getPayslips);

/**
 * GET /api/payslips/:id
 * Middleware: protect (JWT verification required)
 * Params: id (payslip ID)
 * Response: { success: true, data: payslip }
 * Description: Retrieves single payslip (access control: own or admin)
 */
payslipRouter.get("/:id", protect, getPayslipById);

/**
 * POST /api/payslips
 * Middleware: protect, portectAdmin (admin required)
 * Request: { employeeId, month, year, basicSalary, allowances, deductions }
 * Response: { success: true, data: payslip }
 * Description: Admin creates payslip for employee with salary calculation
 */
payslipRouter.post("/", protect, portectAdmin, createPayslip);

export default payslipRouter;