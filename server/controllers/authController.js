/**
 * Authentication Controller - Handles user login, session, and password management
 * Uses bcrypt for password hashing and jwt for token generation
 * 
 * bcrypt.hash(password, salt) - Hashes password with salt rounds for security
 * bcrypt.compare(plainPassword, hashedPassword) - Compares plain password with hash
 * jwt.sign(payload, secret, options) - Creates signed JWT token
 * jwt.verify(token, secret) - Verifies and decodes token (done in middleware)
 */

import User from "../models/User.js";
import bcrypt from "bcrypt"; // Password hashing library for secure storage
import jwt from "jsonwebtoken"; // JWT token library for stateless authentication

/**
 * login - Authenticates user and returns JWT token
 * POST /api/auth/login
 * 
 * Process:
 * 1. Validate email and password are provided
 * 2. Find user by email
 * 3. Verify role matches requested role_type (admin/employee)
 * 4. Compare provided password with hashed password using bcrypt.compare()
 * 5. Generate JWT token with user info
 * 
 * bcrypt.compare() - Compares plaintext password with hash, returns boolean
 * jwt.sign(payload, secret, expiresIn) - Creates token with 7 day expiration
 */
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user in database by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify role matches requested access (admin vs employee)
    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({ error: "Not authorized as admin" });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({ error: "Not authorized as employee" });
    }

    // bcrypt.compare() - Verifies password matches stored hash
    // Returns true if password is correct, false otherwise
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT payload with user information
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    // jwt.sign() - Creates signed token
    // Token includes payload + secret signature
    // expiresIn: "7d" means token valid for 7 days
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user: payload, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

/**
 * session - Returns authenticated user's session data
 * GET /api/auth/session
 * Middleware: protect (verifies JWT token)
 * 
 * Returns user info from decoded JWT token stored in req.session by protect middleware
 */
export const session = (req, res) => {
  const session = req.session;

  return res.json({ user: session });
};

/**
 * changePassword - Updates user's password after verifying current password
 * POST /api/auth/change-password
 * Middleware: protect (verifies JWT token)
 * 
 * Process:
 * 1. Verify both currentPassword and newPassword provided
 * 2. Find user by ID from JWT token
 * 3. Use bcrypt.compare() to verify current password
 * 4. Hash new password using bcrypt.hash()
 * 5. Update password in database
 * 
 * bcrypt.hash(password, saltRounds) - Creates hash with 10 salt rounds (high security)
 */
export const changePassword = async (req, res) => {
  try {
    const session = req.session;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }

    // Find user by ID from authenticated session
    const user = await User.findById(session.userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    // bcrypt.compare() - Verify current password matches stored hash
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      return res.status(400).json({ error: "Current password is incorrect" });

    // bcrypt.hash() - Hash new password with 10 salt rounds
    // Higher salt rounds = more secure but slower
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update user's password in database
    await User.findByIdAndUpdate(session.userId, {
      password: hashed,
    });
    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to change the password" });
  }
};
