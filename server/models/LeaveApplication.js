/**
 * LeaveApplication Model - Mongoose schema for employee leave requests
 * Tracks leave applications with type, dates, and approval status
 */

import mongoose from "mongoose";

/**
 * leaveApplicationSchema - MongoDB schema for LeaveApplication collection
 * 
 * Fields:
 * - employeeId: Reference to Employee who requested leave
 * - type: SICK, CASUAL, or ANNUAL leave classification
 * - startDate/endDate: Leave period dates
 * - reason: Reason for leave request
 * - status: PENDING (awaiting approval), APPROVED, or REJECTED
 */
const leaveApplicationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["SICK", "CASUAL", "ANNUAL"], // Leave type classification
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

/**
 * mongoose.models.LeaveApplication - Prevents model recompilation
 * mongoose.model() - Creates LeaveApplication model from schema
 */
const LeaveApplication =
  mongoose.models.LeaveApplication ||
  mongoose.model("LeaveApplication", leaveApplicationSchema);

export default LeaveApplication;
