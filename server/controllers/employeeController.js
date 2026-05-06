/**
 * Employee Controller - Manages employee records (CRUD operations)
 * Uses mongoose transactions for data consistency
 * 
 * mongoose.startSession() - Creates session for transaction support
 * session.withTransaction() - Wraps operations in atomic transaction
 * session.endSession() - Cleanup session after transaction complete
 * 
 * bcrypt.hash(password, saltRounds) - Hashes passwords securely
 * Employee.find/create/update/delete - Mongoose model methods
 */

import Employee from "../models/Employee.js";
import bcrypt from "bcrypt"; // Password hashing
import User from "../models/User.js";
import mongoose from "mongoose"; // MongoDB transaction support

/**
 * getEmployees - Retrieves all employees with optional department filter
 * GET /api/employees
 * Middleware: protect, portectAdmin
 * 
 * Uses:
 * - Employee.find(where) - Queries employees with filter condition
 * - .sort({ createdAt: -1 }) - Sorts by newest first (-1 = descending)
 * - .populate("userId", "email role") - Joins User collection, selects specific fields
 * - .lean() - Returns plain JavaScript objects (faster, read-only)
 */
export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const where = {};
    if (department) where.department = department; // Filter by department if provided

    // find(where) - Queries matching documents
    // sort() - Orders results (field, direction)
    // populate() - Joins referenced collection (User)
    // lean() - Optimizes for read-only queries
    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    // Map employees to include id and user object
    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? { email: emp.userId.email, role: emp.userId.role }
        : null,
    }));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

/**
 * createEmployee - Creates new employee record with associated user account
 * POST /api/employees
 * Middleware: protect, portectAdmin
 * 
 * Uses MongoDB Transactions for ACID compliance:
 * - mongoose.startSession() - Creates transaction session
 * - session.withTransaction() - Atomically executes operations
 * - If any operation fails, entire transaction rolls back
 * 
 * Process:
 * 1. Start transaction session
 * 2. Create User record with hashed password
 * 3. Create Employee record linked to User
 * 4. Commit transaction or rollback on error
 * 5. Cleanup session
 */
// Create employee
// POST /api/employees
export const createEmployee = async (req, res) => {
  let session;

  try {
    // mongoose.startSession() - Creates session for transaction support
    // Allows multiple operations to be atomic (all succeed or all fail)
    session = await mongoose.startSession();

    let createdEmployee;

    // session.withTransaction() - Wraps operations in transaction
    // Automatically commits if no error, rolls back if error thrown
    await session.withTransaction(async () => {
      const {
        firstName,
        lastName,
        email,
        phone,
        position,
        basicSalary,
        allowances,
        deductions,
        joinDate,
        role,
        bio,
        department,
        password,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        throw new Error("Missing required fields");
      }

      // bcrypt.hash(password, saltRounds) - Hashes password
      // 10 = salt rounds (higher = more secure but slower)
      const hashed = await bcrypt.hash(password, 10);

      // User.create(docs, options) - Creates user with transaction session
      // Returns array of created documents
      const user = await User.create(
        [
          {
            email,
            password: hashed,
            role: role || "EMPLOYEE",
          },
        ],
        { session }, // Pass session to bind operation to transaction
      );

      // Employee.create(docs, options) - Creates employee linked to user
      const employee = await Employee.create(
        [
          {
            userId: user[0]._id, // Reference created user
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio: bio || "",
          },
        ],
        { session },
      );

      // Store for response (outside transaction scope)
      createdEmployee = employee[0];
    });

    // Transaction committed successfully
    return res.status(201).json({
      success: true,
      employee: createdEmployee,
    });
  } catch (error) {
    // Error code 11000 = MongoDB duplicate key violation
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // Handle manually thrown validation error
    if (error.message === "Missing required fields") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("Create employee error:", error);

    return res.status(500).json({
      error: "Failed to create employee",
    });
  } finally {
    // Always cleanup session, even if error occurs
    if (session) session.endSession();
  }
};

/**
 * updateEmployee - Updates employee information and associated user account
 * PUT /api/employees/:id
 * Middleware: protect, portectAdmin
 * 
 * Uses:
 * - Employee.findById(id) - Retrieves employee before update
 * - Employee.findByIdAndUpdate(id, updateObj) - Updates employee fields
 * - User.findByIdAndUpdate(id, updateObj) - Updates linked user record
 */
// Update employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      basicSalary,
      allowances,
      deductions,
      role,
      bio,
      department,
      password,
      employmentStatus,
    } = req.body;

    // findById(id) - Retrieves document by MongoDB _id
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // findByIdAndUpdate(id, updateObj) - Updates and returns modified document
    await Employee.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      employmentStatus: employmentStatus || "ACTIVE",
      bio: bio || "",
    });

    // Update linked user record with email and optional password/role
    const userUpdate = {
      email,
    };
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10); // Hash if updating password

    // Update User by linked userId
    await User.findByIdAndUpdate(employee.userId, userUpdate);

    return res.json({ success: true });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to update employee" });
  }
};

/**
 * deleteEmployee - Performs soft delete on employee record
 * DELETE /api/employees/:id
 * Middleware: protect, portectAdmin
 * 
 * Soft Delete: Sets isDeleted flag to true instead of removing record
 * Preserves data for audit trails and prevents cascading issues
 * 
 * Uses:
 * - Employee.findByIdAndUpdate(id, {isDeleted: true}) - Marks as deleted
 */
// Delete employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";
    await employee.save();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete employee" });
  }
};
