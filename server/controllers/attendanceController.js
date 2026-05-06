/**
 * Attendance Controller - Manages employee check-in/check-out operations
 * Calculates working hours and classifies day type based on hours worked
 * Uses Inngest for automated event scheduling
 * 
 * inngest.send() - Sends event to Inngest event handler for background jobs
 * new Date().getTime() - Gets current time in milliseconds for duration calculation
 */

import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import { inngest } from "../inngest/index.js"; // Event handler for background jobs

/**
 * clockInOut - Handles employee check-in or check-out
 * POST /api/attendance
 * Middleware: protect (verifies JWT)
 * 
 * Process:
 * 1. Find employee linked to authenticated user
 * 2. Check for today's attendance record
 * 3. If none exists: Create check-in record and trigger auto checkout event
 * 4. If no checkout: Calculate working hours, classify day type, save checkout
 * 5. If already checked out: Return existing record
 * 
 * Day Type Classification:
 * - Full Day: >= 8 hours
 * - Three Quarter Day: >= 6 hours
 * - Half Day: >= 4 hours
 * - Short Day: < 4 hours
 */
//Clock in/out for employee
//POST /api/attendance
export const clockInOut = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    if (employee.isDeleted)
      return res.status(404).json({
        error: "Your account is deactivated. You cannot clock in/out.",
      });

    // Set today's date at midnight (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record for this employee
    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();
    if (!existing) {
      // First check-in of the day
      // Determine if check-in is late (after 9:00 AM)
      const isLate =
        now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
      
      // Create attendance record with check-in time
      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });

      // inngest.send() - Sends event for auto-checkout at end of day
      // Event handler will automatically check out employee at specific time
      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id,
          attendanceId: attendance._id,
        },
      });

      return res.json({
        success: true,
        type: "CHECK_IN",
        data: attendance,
      });
    } else if (!existing.checkOut) {
      // Employee is already checked in, now checking out
      
      // Get check-in time in milliseconds
      const checkInTime = new Date(existing.checkIn).getTime();
      // Get current time in milliseconds
      const diffMs = now.getTime() - checkInTime;
      // Convert milliseconds to hours
      const diffHours = diffMs / (1000 * 60 * 60);

      // Set checkout time
      existing.checkOut = now;

      // Calculate working hours (2 decimal places precision)
      const workingHours = parseFloat(diffHours.toFixed(2));
      
      // Classify day type based on working hours
      let dayType = "Half Day";
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";
      else dayType = "Short Day";

      existing.workingHours = workingHours;
      existing.dayType = dayType;

      // Save checkout record to database
      await existing.save();

      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    } else {
      // Already checked out, return existing record
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    }

    return res.json(employee);
  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ error: "Operation failed" });
  }
};

/**
 * getAttendance - Retrieves attendance history for logged-in employee
 * GET /api/attendance
 * Middleware: protect (verifies JWT)
 * 
 * Uses:
 * - Attendance.find() - Queries attendance records
 * - .sort({ date: -1 }) - Sorts newest first
 * - .limit(limit) - Limits number of records returned (default 30)
 */
//GET attendance for employee
//GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    // Parse limit from query (default 30 records)
    const limit = parseInt(req.query.limit || 30);
    
    // find() - Queries attendance for employee
    // sort({date: -1}) - Newest records first
    // limit(num) - Returns only first N records
    const history = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(limit);

    return res.json({
      data: history,
      employee: { isDeleted: employee.isDeleted },
    });
  } catch (error) {
    return res.status(500).json({ error: "Operation failed" });
  }
};
