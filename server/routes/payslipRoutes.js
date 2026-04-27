import { Router } from "express";
import { createPayslip, getPayslipById, getPayslips } from "../controllers/payslipController.js";
import { portectAdmin, protect } from "../middleware/auth.js";

const payslipRouter = Router();

payslipRouter.get("/", protect, getPayslips);
payslipRouter.get("/:id", protect, getPayslipById);
payslipRouter.post("/", protect, portectAdmin, createPayslip);

export default payslipRouter;