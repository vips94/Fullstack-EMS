import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController";
import { portectAdmin, protect } from "../middleware/auth";

const employeesRouter = Router();

employeesRouter.get("/", protect, portectAdmin, getEmployees);
employeesRouter.post("/", protect, portectAdmin, createEmployee);
employeesRouter.put("/:id", protect, portectAdmin, updateEmployee);
employeesRouter.delete("/:id", protect, portectAdmin, deleteEmployee);

export default employeesRouter;
