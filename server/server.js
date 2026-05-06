/**
 * Main Server File - Express.js application setup
 * Initializes middleware, routes, and database connection
 * Uses libraries: express (web framework), cors (cross-origin requests),
 * dotenv (environment variables), multer (form-data parsing), inngest (event handling)
 */

import express from "express";
import cors from "cors"; // Middleware to handle Cross-Origin Resource Sharing
import "dotenv/config"; // Loads environment variables from .env file
import multer from "multer"; // Middleware for parsing multipart form data (files, form fields)
import connectDB from "./config/db.js"; // MongoDB connection function
import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payslipRouter from "./routes/payslipRoutes.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import { serve } from "inngest/express"; // Inngest Express middleware for event handling
import { inngest, functions } from "./inngest/index.js"; // Inngest event handler setup

const app = express(); // Create instance of express application
const PORT = process.env.PORT || 4000;

// ====== MIDDLEWARE CONFIGURATION ======
// cors() - Enables Cross-Origin Resource Sharing, allows requests from different domains
app.use(cors());

// express.json() - Parses incoming request bodies with JSON content type
app.use(express.json());

// multer().none() - Parses form data without file uploads (none() = no file handling)
app.use(multer().none());

//Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRoute);
app.use("/api/leave", leaveRoutes);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);
// Inngest event handling middleware - exposes event endpoints
app.use("/api/inngest", serve({ client: inngest, functions }));

// ====== SERVER STARTUP ======
/**
 * startServer - Initializes database connection and starts Express server
 * Uses async/await for sequential execution: connects DB first, then starts server
 */
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB database
    app.listen(PORT, () => console.log(`server is listening to port ${PORT}`));
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1); // Exit process with error code
  }
};

startServer();
