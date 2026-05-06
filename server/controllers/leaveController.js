/**
 * Leave Controller - Manages leave applications (CRUD + approval workflow)
 * Handles employee leave requests and admin approval/rejection
 * Uses Inngest for event notifications
 * 
 * inngest.send() - Sends event for background job processing
 * LeaveApplication.find/create/findByIdAndUpdate - Mongoose operations
 * .populate("employeeId") - Joins Employee collection to get full details
 */

import { inngest } from "../inngest/index.js"; // Event handler
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";

/**
 * createLeave - Creates new leave application request
 * POST /api/leave
 * Middleware: protect (verifies JWT)
 * 
 * Validation:
 * - Check employee not deleted
 * - Verify all required fields provided
 * - Ensure dates are in the future
 * - Ensure end date >= start date
 * 
 * inngest.send() - Triggers background event for notifications
 */
// Create Leave
// POST /api/leaves
export const createLeave = async (req, res) => {
  try {
    const session = req.session;

    // Find employee linked to authenticated user
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot apply for leave.",
      });
    }

    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate dates are in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight

    if (new Date(startDate) <= today || new Date(endDate) <= today) {
      return res
        .status(400)
        .json({ error: "Leave dates must be in the future" });
    }

    // Validate end date >= start date
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ error: "End Date cannot be before start Date" });
    }

    // Create leave application with PENDING status
    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
    });

    // inngest.send() - Send event for admin notification
    // Event handler will process this asynchronously
    await inngest.send({
      name: "leave/pending",
      data: { leaveApplicationId: leave._id },
    });

    return res.json({ success: true, data: leave });
  } catch (error) {
    return res.status(403).json({ error: "Operation failed." });
  }
};

/**
 * getLeaves - Retrieves leave applications (different for admin vs employee)
 * GET /api/leave
 * Middleware: protect (verifies JWT)
 * 
 * Admin: Returns all leaves with optional status filter
 * Employee: Returns only their own leaves
 * 
 * Uses:
 * - .populate("employeeId") - Joins Employee collection
 * - .sort({ createdAt: -1 }) - Newest first
 * - .toObject() - Converts mongoose document to plain JS object
 */
// Get Leave
// GET /api/leaves
export const getLeaves = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";
    
    if (isAdmin) {
      // Admin sees all leaves with optional status filter
      const status = req.query.status;
      const where = status ? { status } : {}; // Filter by status if provided
      
      // find(filter) - Queries with filter
      // populate("employeeId") - Joins Employee collection data
      // sort() - Orders by creation date
      const leaves = await LeaveApplication.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });

      // Map to include id and employee fields
      const data = leaves.map((l) => {
        const obj = l.toObject(); // Convert mongoose doc to plain object
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });
      return res.json({ data });
    } else {
      // Employee sees only their leaves
      const employee = await Employee.findOne({ userId: session.userId });
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      const leaves = await LeaveApplication.find({
        employeeId: employee._id,
      }).sort({ createdAt: -1 });

      return res.json({
        data: leaves,
        employee: { ...employee, id: employee._id.toString() },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Operation failed." });
  }
};

/**
 * updateLeaveStatus - Updates leave application status (admin only)
 * PATCH /api/leave/:id
 * Middleware: protect, portectAdmin
 * 
 * Allowed statuses: PENDING, APPROVED, REJECTED
 * Uses findByIdAndUpdate with { returnDocument: "after" } to get updated record
 */
// Update Leave
// PATCH /api/leaves
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status is allowed value
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    // findByIdAndUpdate(id, update, options)
    // { returnDocument: "after" } returns updated document
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" },
    );
    
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }
    
    return res.json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ error: "Operation failed." });
  }
};
