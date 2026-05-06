/**
 * User Model - Mongoose schema for user authentication
 * Represents system users (Admin or Employee accounts)
 * Uses mongoose.Schema() to define document structure and validation
 */

import mongoose from "mongoose";

/**
 * userSchema - MongoDB schema for User collection
 * mongoose.Schema() - Defines field types, validation, and options
 * 
 * Fields:
 * - email: String, unique, required, trimmed, lowercase
 * - password: String, required (will be hashed by bcrypt before saving)
 * - role: Enum of ["ADMIN", "EMPLOYEE"], defaults to "EMPLOYEE"
 * 
 * { timestamps: true } - Automatically adds createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate emails in database
      trim: true, // Removes whitespace from both ends
      lowercase: true, // Converts email to lowercase
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"], // Only allows these two values
      default: "EMPLOYEE",
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }, // Auto-add createdAt and updatedAt fields
);

/**
 * mongoose.models.User - Checks if model already exists to prevent duplicate compilation
 * mongoose.model() - Creates/retrieves User model from schema
 * Using || pattern prevents "Cannot overwrite model" error in development
 */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
