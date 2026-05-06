import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import LeaveApplication from "../models/LeaveApplication.js";
import { DEPARTMENTS } from "../constants/departments.js";
import Payslip from "../models/Payslip.js";

/**
 * Dashboard Controller - Provides role-specific dashboard statistics
 * 
 * Admin Dashboard: Company-wide metrics
 * Employee Dashboard: Personal metrics and records
 * 
 * Uses:
 * - Promise.all() - Executes multiple async queries in parallel (faster than sequential)
 * - .countDocuments(query) - Counts documents matching filter without fetching data
 * - Date range queries with $gte (>=) and $lt (<) operators
 * - .lean() - Returns plain objects for read-only dashboard queries
 * - .sort() and findOne() for latest record retrieval
 */

/**
 * getDashboard - Returns dashboard data based on user role
 * GET /api/dashboard
 * Middleware: protect (verifies JWT)
 * 
 * ADMIN Dashboard returns:
 * - totalEmployees: Count of non-deleted employees
 * - totalAttendance: Check-ins recorded today
 * - pendingLeaves: Leave requests awaiting approval
 * - totalDepartments: Number of departments
 * 
 * EMPLOYEE Dashboard returns:
 * - employee: Current employee profile data
 * - currentMonthAttendance: Days attended in current month
 * - pendingLeaves: Employee's pending leave requests
 * - latestPayslip: Most recent payslip record
 * 
 * Uses:
 * - Promise.all([queries]) - Parallel async execution for better performance
 * - countDocuments({filter}) - Counts matching documents efficiently
 * - Date filtering: new Date().setHours(0,0,0,0) for midnight times
 * - $gte (greater-than-equal) and $lt (less-than) for date ranges
 * - getFullYear(), getMonth(), day 1 for month-start/month-end dates
 * - findOne().sort({createdAt: -1}).lean() for latest record query
 */
//Get dashboard for employee and admin
//GET /api/dashboard

export const getDashboard = async (req, res) => {
  try {
    const session = req.session;
    
    // Check if authenticated user is admin
    if (session.role === "ADMIN") {
      // Promise.all([...queries]) - Executes all three queries in parallel
      // Faster than sequential queries: await query1; await query2; await query3
      const [totalEmployees, totalAttendance, pendingLeaves] =
        await Promise.all([
          // countDocuments({filter}) - Returns count of documents matching filter
          // { isDeleted: { $ne: true } } - Documents where isDeleted is NOT equal to true
          // $ne operator = "not equal" (excludes soft-deleted employees)
          Employee.countDocuments({ isDeleted: { $ne: true } }),
          
          // Attendance count for today
          // new Date().setHours(0, 0, 0, 0) - Sets time to midnight (start of day)
          // new Date().setHours(24, 0, 0, 0) - Sets time to midnight tomorrow (end of day)
          // $gte: greater-than-or-equal operator, $lt: less-than operator
          // This creates: today >= date < tomorrow (full 24-hour period)
          Attendance.countDocuments({
            date: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          }),
          
          // Count pending leave requests
          // status: "PENDING" - Only leaves awaiting approval
          LeaveApplication.countDocuments({ status: "PENDING" }),
        ]);

      // Return admin dashboard with aggregated statistics
      return res.json({
        role: "ADMIN",
        totalEmployees,
        totalAttendance,
        pendingLeaves,
        totalDepartments: DEPARTMENTS.length,
      });
    } else {
      // EMPLOYEE Dashboard - Personal metrics
      
      // findOne({ userId }) - Queries for single employee record
      // lean() - Returns plain JS object (optimized for read-only dashboard)
      const employee = await Employee.findOne({
        userId: session.userId,
      }).lean();
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      // Get current date for month calculations
      const today = new Date();
      
      // Promise.all([queries]) - Execute three queries in parallel
      const [currentMonthAttendance, pendingLeaves, latestPayslip] =
        await Promise.all([
          // Count attendance for current month
          // new Date(year, month, day) - JavaScript Date constructor
          // getFullYear() returns year (e.g., 2024)
          // getMonth() returns 0-based month (0=January, 11=December)
          // new Date(year, month, 1) - First day of current month at 00:00:00
          // new Date(year, month + 1, 1) - First day of next month (creates month boundary)
          // $gte: date >= first day of month, $lt: date < first day of next month
          Attendance.countDocuments({
            employeeId: employee._id,
            date: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
              $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
          }),
          
          // Count employee's pending leave requests
          LeaveApplication.countDocuments({
            employeeId: employee._id,
            status: "PENDING",
          }),
          
          // Fetch latest payslip for employee
          // findOne({filter}) - Returns single document or null
          // sort({createdAt: -1}) - Sorts by creation date descending (newest first)
          // lean() - Optimized plain object return
          Payslip.findOne({ employeeId: employee._id })
            .sort({ createdAt: -1 })
            .lean(),
        ]);
      
      // Return employee dashboard with personal metrics
      return res.json({
        role: "EMPLOYEE",
        employee: {
          ...employee,
          id: employee._id.toString(),
        },
        currentMonthAttendance,
        pendingLeaves,
        // Ternary operator: return formatted payslip if exists, else return null
        latestPayslip: latestPayslip
          ? { ...latestPayslip, id: latestPayslip._id.toString() }
          : null,
      });
    }
  } catch (error) {
    console.error("dashboard error:", error);
    return res.status(500).json({ error: "Operation failed." });
  }
};
