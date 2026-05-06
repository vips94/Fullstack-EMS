/**
 * Employee Model - Mongoose schema for employee records
 * Stores detailed employee information linked to User model
 * mongoose.Schema.Types.ObjectId - Creates references between collections
 */

import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/departments.js";

/**
 * employeeSchema - MongoDB schema for Employee collection
 * 
 * Key Features:
 * - userId: References User model for authentication (one-to-one relationship)
 * - Enum validations for department, employmentStatus to ensure data integrity
 * - Default values for salary components
 * - Timestamps for audit trail
 */
const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User collection
      ref: "User", // Links to User model
      required: true,
      unique: true, // Each employee has exactly one user account
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    position: { type: String, required: true },
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 }, // Additional benefits/bonuses
    deductions: { type: Number, default: 0 }, // Taxes, insurance, etc.
    employmentStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"], // Employment status validation
      default: "ACTIVE",
    },
    joinDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
    bio: { type: String, default: "" },
    department: { type: String, enum: DEPARTMENTS }, // Department validation from constants
  },
  { timestamps: true }, // Auto-add createdAt and updatedAt
);

/**
 * mongoose.models.Employee - Prevents model recompilation in dev mode
 * mongoose.model() - Creates Employee model from schema
 */
const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
