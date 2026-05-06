/**
 * Payslip Model - Mongoose schema for employee payslips
 * Stores salary calculation records for monthly payroll
 */

import mongoose from "mongoose";

/**
 * payslipSchema - MongoDB schema for Payslip collection
 * 
 * Fields:
 * - employeeId: Reference to Employee for payslip
 * - month/year: Period of payslip (1-12 for month, YYYY for year)
 * - basicSalary: Base salary amount
 * - allowances: Bonuses, benefits, additional compensation
 * - deductions: Tax, insurance, loan deductions
 * - netSalary: Final amount = basicSalary + allowances - deductions
 */
const payslipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true }, // YYYY format
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
  },
  { timestamps: true },
);

/**
 * mongoose.models.Payslip - Prevents model recompilation
 * mongoose.model() - Creates Payslip model from schema
 */
const Payslip =
  mongoose.models.Payslip || mongoose.model("Payslip", payslipSchema);

export default Payslip;
