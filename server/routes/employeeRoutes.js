/**
 * Employee Routes - Employee CRUD operations
 * All routes require admin authorization
 * 
 * Middleware chain:
 * - protect: JWT verification middleware
 * - portectAdmin: Role verification (admin only)
 * Both must pass for route to execute
 */

import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController.js";
import { portectAdmin, protect } from "../middleware/auth.js";

const employeesRouter = Router();

/**
 * GET /api/employees
 * Middleware: protect, portectAdmin (admin required)
 * Query params: ?department=SALES (optional filter)
 * Response: { success: true, data: [employees] }
 * Description: Retrieves all employees with optional department filter
 */
employeesRouter.get("/", protect, portectAdmin, getEmployees);

/**
 * POST /api/employees
 * Middleware: protect, portectAdmin (admin required)
 * Request: { firstName, lastName, email, department, salary }
 * Response: { success: true, data: employee }
 * Description: Creates new employee with user account (atomic transaction)
 */
employeesRouter.post("/", protect, portectAdmin, createEmployee);

/**
 * PUT /api/employees/:id
 * Middleware: protect, portectAdmin (admin required)
 * Params: id (employee ID)
 * Request: { firstName, lastName, email, department, salary, password (optional) }
 * Response: { success: true, data: employee }
 * Description: Updates employee information and optional password change
 */
employeesRouter.put("/:id", protect, portectAdmin, updateEmployee);

/**
 * DELETE /api/employees/:id
 * Middleware: protect, portectAdmin (admin required)
 * Params: id (employee ID)
 * Response: { success: true }
 * Description: Soft deletes employee (sets isDeleted: true)
 */
employeesRouter.delete("/:id", protect, portectAdmin, deleteEmployee);

export default employeesRouter;
