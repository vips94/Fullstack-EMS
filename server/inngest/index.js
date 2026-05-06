/**
 * Inngest Functions - Background job processing and event handling
 * 
 * Inngest provides: Event-driven architecture for async operations
 * - Triggers on specific events or cron schedules
 * - step.sleepUntil(id, date) - Waits until specific time
 * - step.run(id, async func) - Executes retry-safe operations
 * - Built-in reliability: retry logic, event history, monitoring
 * 
 * Three main functions:
 * 1. autoCheckout - Auto-marks attendance as checked out after 9+ hours
 * 2. leaveApplicationReminder - Sends admin reminder if leave pending 24+ hours
 * 3. attendanceReminderCron - Sends absence reminder to employees daily
 */

import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import sendEmail from "../config/nodeemailer.js";

/**
 * inngest - Inngest client for creating and managing functions
 * new Inngest({ id: "fullstack-ems" }) - Creates client with app identifier
 */
// Create a client to send and receive events
export const inngest = new Inngest({ id: "fullstack-ems" });

/**
 * autoCheckout - Automatically checks out employee after 9 hours
 * Trigger: "employee/check-out" event
 * 
 * Process:
 * 1. Wait 9 hours for employee to check out manually
 * 2. Send reminder email if still not checked out
 * 3. Wait 1 more hour
 * 4. Auto-checkout at 10 hours with "Half Day" status and "LATE" tag
 * 
 * Uses:
 * - step.sleepUntil(id, date) - Waits until timestamp, retry-safe
 * - Attendance.findById() - Queries attendance record
 * - sendEmail() - Sends notification emails
 * - attendance.save() - Persists updated attendance record
 */
// Auto checkout for employees
const autoCheckout = inngest.createFunction(
  { id: "auto-check-out", triggers: [{ event: "employee/check-out" }] },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // step.sleepUntil(id, date) - Waits until specified date/time
    // Provides retry-safe waiting (resumes if function fails)
    // 9 * 60 * 60 * 1000 = 9 hours in milliseconds
    await step.sleepUntil(
      "wait-for-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    );

    // Query attendance record from database
    let attendance = await Attendance.findById(attendanceId);
    
    // Check if employee hasn't checked out yet
    if (!attendance?.checkOut) {
      // Get employee record for email details
      const employee = await Employee.findById(employeeId);

      // Send email reminder to employee
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: `<div style="max-width: 600px;">
                    <h2>Hi ${employee.firstName}, 👋</h2>
                    <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                    <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
                    <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                    <br />
                    <p style="font-size: 16px;">Best Regards,</p>
                    <p style="font-size: 16px;">EMS</p>
                </div>`,
      });

      // Wait 1 more hour (total 10 hours from check-in)
      // After this, if still no checkout, auto-checkout
      await step.sleepUntil(
        "wait-for-the-1-hour",
        new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      );
      
      // Re-fetch attendance (might have been manually checked out)
      attendance = await Attendance.findById(attendanceId);
      
      if (!attendance?.checkOut) {
        // Auto-checkout: set checkout time to 4 hours after check-in
        // new Date(attendance.checkIn).getTime() - Get check-in timestamp
        // + 4 * 60 * 60 * 1000 - Add 4 hours in milliseconds
        attendance.checkOut = new Date(
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000,
        );
        attendance.workingHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";
        
        // save() - Persists changes to MongoDB
        await attendance.save();
      }
    }
  },
);

/**
 * leaveApplicationReminder - Sends admin reminder for pending leave applications
 * Trigger: "leave/pending" event (triggered when leave request created)
 * 
 * Process:
 * 1. Wait 24 hours
 * 2. Check if leave still PENDING
 * 3. Send email reminder to admin email
 * 
 * Uses:
 * - step.sleepUntil() - Waits 24 hours
 * - LeaveApplication.findById() - Queries leave record
 * - process.env.ADMIN_EMAIL - Configuration from .env file
 * - sendEmail() - Sends notification
 */
// Send Email to admin, if admin doesn't take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // step.sleepUntil() waits for 24 hours
    // 24 * 60 * 60 * 1000 = 24 hours in milliseconds
    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );

    // Query leave application from database
    const leaveApplication =
      await LeaveApplication.findById(leaveApplicationId);

    // Only send reminder if leave is still in PENDING status
    if (leaveApplication?.status === "PENDING") {
      // Get employee details for email content
      const employee = await Employee.findById(leaveApplication.employeeId);

      // Send reminder email to admin (configured in .env ADMIN_EMAIL)
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "Leave Application Reminder",
        body: `<div style="max-width: 600px;">
                <h2>Hi Admin, 👋</h2>
                <p style="font-size: 16px;">You have a leave application in ${employee.department} today:</p>
                <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${leaveApplication?.startDate?.toLocaleDateString()}</p>
                <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
                <br />
                <p style="font-size: 16px;">Best Regards,</p>
                <p style="font-size: 16px;">EMS</p>
            </div>`,
      });
    }
  },
);

/**
 * attendanceReminderCron - Daily cron job to remind absent employees
 * Trigger: Cron expression "TZ=Asia/Kolkata 30 11 * * *" (11:30 AM IST daily)
 * 
 * Process:
 * 1. Get today's date range in IST timezone
 * 2. Fetch all active, non-deleted employees
 * 3. Get employee IDs on approved leave today
 * 4. Get employee IDs who already checked in today
 * 5. Filter absent employees (not on leave AND not checked in)
 * 6. Send reminder emails to absent employees
 * 
 * Uses:
 * - Cron triggers: "TZ=Asia/Kolkata 30 11 * * *" runs daily at 11:30 AM IST
 * - step.run(id, async func) - Executes operations with retry-safety
 * - toLocaleDateString("en-CA", {timeZone}) - Date formatting in specific timezone
 * - $lte, $gte date operators - Date range queries
 * - Promise.all() - Parallel async operations
 * - filter() and includes() - Array operations for absent employee detection
 */
// Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employee
const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: [{ cron: "TZ=Asia/Kolkata 30 11 * * *" }],
  },
  // 06:00 UTC = 11:30 AM IST
  async ({ event, step }) => {
    // Step 1: Calculate today's date range in IST timezone
    const today = await step.run("get-today-date", () => {
      // toLocaleDateString("en-CA", {timeZone}) formats date in YYYY-MM-DD format for specified timezone
      // en-CA locale provides ISO-like format
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) +
          "T00:00:00+05:30",
      );
      // Add 24 hours to get end of day
      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
      return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
    });

    // Step 2: Fetch all active employees
    // step.run() provides retry-safety for critical operations
    const activeEmployee = await step.run("get-active-employee", async () => {
      // find({filters}) - Queries multiple documents
      // isDeleted: false - Excludes soft-deleted employees
      // employmentStatus: "ACTIVE" - Only active employees
      // lean() - Returns plain objects (optimized for read-only)
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: "ACTIVE",
      }).lean();

      // Map to extract needed fields only
      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Get employee IDs who are on approved leave today
    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      // $lte: less-than-or-equal, $gte: greater-than-or-equal
      // startDate <= today's end AND endDate >= today's start = overlaps with today
      const leaves = await LeaveApplication.find({
        status: "APPROVED",
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();

      // Extract employee IDs and convert to strings for comparison
      return leaves.map((l) => l.employeeId.toString());
    });

    // Step 4: Get employee IDs who already checked in today
    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      // Date range query: records between start and end of today
      // $gte: today.startUTC, $lt: today.endUTC
      const attendance = await Attendance.find({
        date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) },
      }).lean();

      // Extract employee IDs for comparison
      return attendance.map((a) => a.employeeId.toString());
    });

    // Step 5: Filter employees who are absent
    // filter() returns new array with matching conditions
    // Absent = NOT on leave AND NOT checked in
    // !onLeaveIds.includes() and !checkedInIds.includes() = negative filters
    const absentEmployees = activeEmployee.filter(
      (emp) => !onLeaveIds.includes(emp._id) && !checkedInIds.includes(emp._id),
    );

    // Step 6: Send reminder emails to absent employees
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        // map() creates array of email promises
        const emailPromise = absentEmployees.map((emp) => {
          // sendEmail returns promise
          sendEmail({
            to: emp.email,
            subject: "Attendance Reminder - Please Mark Your Attendance",
            body: ` <div style="max-width: 600px; font-family: Arial, sans-serif;">
                        <h2>Hi ${emp.firstName}, 👋</h2>
                        <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                        <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                        <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                        <br />
                        <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                        <br />
                        <p style="font-size: 16px;">Best Regards,</p>
                        <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                    </div>`,
          });
        });
        // Promise.all() - Waits for all email sends to complete in parallel
        await Promise.all(emailPromise);
        return { emailSent: absentEmployees.length };
      });
    }

    // Return summary statistics
    return {
      totalActive: activeEmployee.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

/**
 * functions - Array of all Inngest functions
 * Exported for registration with Inngest server
 */
// Create an empty array where we'll export future Inngest functions
export const functions = [
  autoCheckout,
  leaveApplicationReminder,
  attendanceReminderCron,
];
