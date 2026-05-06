import Employee from "../models/Employee.js";

/**
 * Profile Controller - Manages employee profile operations
 * Handles profile retrieval and updates
 * 
 * Uses:
 * - .findOne() - Queries single document with conditions
 * - .lean() - Returns plain JS objects (read-only, optimized)
 * - soft delete validation (isDeleted flag)
 */

/**
 * getProfile - Retrieves employee profile
 * GET /api/profile
 * Middleware: protect (verifies JWT)
 * 
 * Process:
 * - If authenticated user is an employee: returns employee profile data
 * - If authenticated user is admin (not in Employee collection): returns admin profile with email
 * 
 * Uses:
 * - .findOne({ userId: session.userId }) - Queries Employee by userId field
 * - session.userId from JWT middleware
 * - session.email from JWT token data
 */
// Get profile
// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    
    // findOne({ userId: session.userId }) - Queries Employee collection for matching userId
    // Returns first document matching condition or null if none found
    const employee = await Employee.findOne({ userId: session.userId });
    
    if (!employee) {
      // Authenticated user is not an employee (likely admin)
      // Return admin profile with basic info from JWT session
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: session.email,
      });
    }
    
    // Return employee profile data from database
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * updateProfile - Updates employee profile information
 * PUT /api/profile
 * Middleware: protect (verifies JWT)
 * 
 * Allowed fields: bio
 * Security: Verifies account is not soft-deleted before update
 * 
 * Uses:
 * - findOne() - Verify employee exists
 * - isDeleted flag - Soft delete check
 * - findByIdAndUpdate(id, updates) - Updates specified fields
 */
//Update profile
// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    
    // findOne({ userId: session.userId }) - Queries for employee record linked to authenticated user
    const employee = await Employee.findOne({ userId: session.userId });
    
    if (!employee) {
      // Authenticated user is not an employee (likely admin)
      return res.status(404).json({ error: "Employee not found" });
    }
    
    // Check if employee account is soft-deleted (isDeleted flag)
    // Prevents updates to deleted accounts
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannont update your profile.",
      });
    }
    
    // findByIdAndUpdate(id, updates)
    // - Updates Employee document by _id
    // - Second parameter contains fields to modify: { bio: req.body.bio }
    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });
    
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};
