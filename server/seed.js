/**
 * Seed Script - Database initialization and admin user creation
 * 
 * Purpose: Seeds database with initial admin user
 * Run: node seed.js
 * 
 * Uses:
 * - dotenv/config - Loads environment variables from .env
 * - bcrypt.hash(password, 10) - Creates secure password hash
 * - User.create() - Creates new admin document
 * - User.findOne() - Checks if admin already exists
 */

import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const TemporaryPassword = "admin123";

/**
 * registerAdmin - Creates initial admin user in database
 * 
 * Process:
 * 1. Read ADMIN_EMAIL from environment variables
 * 2. Connect to MongoDB database
 * 3. Check if admin user already exists
 * 4. Hash temporary password with bcrypt
 * 5. Create admin user record
 * 6. Log credentials and exit
 * 
 * Uses:
 * - process.env.ADMIN_EMAIL - Admin email from .env file
 * - connectDB() - Establishes MongoDB connection
 * - User.findOne({ email }) - Queries for existing admin
 * - bcrypt.hash(password, saltRounds) - Creates secure hash with 10 salt rounds
 * - User.create(data) - Creates and saves new user document
 * - process.exit(code) - Exits script with code 0 (success) or 1 (error)
 */
async function registerAdmin() {
  try {
    // Get admin email from environment configuration
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    
    // Validate that ADMIN_EMAIL is set in .env
    if (!ADMIN_EMAIL) {
      console.error("Missing ADMIN_EMAIL env variable");
      process.exit(1);
    }
    
    // Connect to MongoDB database
    await connectDB();
    
    // findOne({ email }) - Queries User collection for existing admin
    // Returns document if found, null if not
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    
    // Exit if admin already exists (prevent duplicates)
    if (existingAdmin) {
      console.log("User already exist as role", existingAdmin.role);
      process.exit(0);
    }
    
    // bcrypt.hash(password, saltRounds)
    // - Hashes password with 10 salt rounds
    // - Takes plain text password and returns irreversible hash
    // - Returns promise with hashed value
    const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);
    
    // User.create(data)
    // - Creates new User document with provided data
    // - Automatically saves to MongoDB
    // - Returns created document with _id
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    // Log admin credentials to console
    console.log("Admin user created");
    console.log("\nemail:", admin.email);
    console.log("password:", TemporaryPassword);
    console.log("\nchange the password after login.");

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

// Execute seed function
registerAdmin();
