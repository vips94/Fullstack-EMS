/**
 * Payslip Controller - Manages payslip generation and retrieval
 * Handles salary calculation and payslip records
 * 
 * Payslip Calculation: netSalary = basicSalary + allowances - deductions
 * .populate("employeeId") - Joins Employee collection
 * .lean() - Returns plain JS objects (read-only, optimized)
 */

import Employee from "../models/Employee.js";
import Payslip from "../models/Payslip.js";

/**
 * createPayslip - Generates payslip for employee for specific month
 * POST /api/payslip
 * Middleware: protect, portectAdmin
 * 
 * Calculates net salary: basicSalary + allowances - deductions
 * Validates employee exists before creating payslip
 */
// Create payslip
// // POST /api/payslip
export const createPayslip = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } =
      req.body;

    // Validate required fields
    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ error: "Missing Fields" });
    }

    // Calculate net salary: basic + allowances - deductions
    const netSalary =
      Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    // Verify employee exists in database
    const employee = await Employee.findOne({ _id: employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    // Create payslip record with calculated net salary
    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      netSalary,
    });
    return res.json({ success: true, data: payslip });
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

/**
 * getPayslips - Retrieves payslips (different for admin vs employee)
 * GET /api/payslips
 * Middleware: protect (verifies JWT)
 * 
 * Admin: Returns all payslips with employee details
 * Employee: Returns only their own payslips
 * 
 * Uses:
 * - .populate("employeeId") - Joins Employee collection
 * - .sort({ createdAt: -1 }) - Newest first
 * - .toObject() - Converts mongoose doc to plain JS
 */
// Get payslips
// GET /api/payslips
export const getPayslips = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";
    
    if (isAdmin) {
      // Admin retrieves all payslips
      // populate("employeeId") - Joins Employee collection data
      const payslips = await Payslip.find()
        .populate("employeeId")
        .sort({ createdAt: -1 });
      
      // Map to include id and employee fields
      const data = payslips.map((p) => {
        const obj = p.toObject(); // Convert to plain object
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });
      return res.json({ data });
    } else {
      // Employee retrieves only their payslips
      const employee = await Employee.findOne({ userId: session.userId });
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      const payslips = await Payslip.find({ employeeId: employee._id }).sort({
        createdAt: -1,
      });
      return res.json({ success: true, data: payslips });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};

/**
 * getPayslipById - Retrieves single payslip by ID
 * GET /api/payslips/:id
 * Middleware: protect (verifies JWT)
 * 
 * Security: Non-admin users can only view their own payslips
 * 
 * Uses:
 * - .populate("employeeId") - Joins Employee collection
 * - .lean() - Returns plain object (read-only, optimized)
 */
// Get payslip by ID
// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
  try {
    // findById(id) - Queries by MongoDB _id
    // populate("employeeId") - Joins Employee data
    // lean() - Optimized for read-only operations
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();
    
    if (!payslip) return res.status(404).json({ error: "Not found" });

    const session = req.session;
    
    // Security check: Non-admin users can only view their own payslips
    if (session.role !== "ADMIN") {
      const employee = await Employee.findOne({ userId: session.userId });
      
      // Verify payslip belongs to authenticated employee
      if (
        !employee ||
        payslip.employeeId._id.toString() !== employee._id.toString()
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
    }
    
    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
    };
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};
