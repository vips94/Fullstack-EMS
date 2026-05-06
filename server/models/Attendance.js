/**
 * Attendance Model - Mongoose schema for daily attendance records
 * Tracks employee check-in/check-out times and working hours
 * Uses compound unique index to prevent duplicate entries per day
 */

import mongoose from "mongoose";

/**
 * attendenceSchema - MongoDB schema for Attendance collection
 * 
 * Fields:
 * - employeeId: Reference to Employee collection
 * - date: Date of attendance record
 * - checkIn/checkOut: Timestamps for work start/end
 * - status: PRESENT, ABSENT, or LATE
 * - workingHours: Calculated duration of work
 * - dayType: Full Day, Half Day, etc. based on hours worked
 * 
 * Unique Index: (employeeId, date) prevents duplicate attendance records
 * for the same employee on the same day
 */
const attendenceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE"],
      default: "PRESENT",
    },
    workingHours: { type: Number, default: null },
    dayType: {
      type: String,
      enum: ["Full Day", "Three Quarter Day", "Half Day", "Short Day", null],
      default: null,
    },
  },
  { timestamps: true },
);

/**
 * attendenceSchema.index() - Creates unique compound index
 * Ensures only one attendance record per employee per day
 * { unique: true } - Enforces uniqueness constraint
 */
attendenceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

/**
 * mongoose.models.Attendance - Prevents model recompilation
 * mongoose.model() - Creates Attendance model from schema
 */
const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendenceSchema);

export default Attendance;
