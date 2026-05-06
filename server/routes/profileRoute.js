/**
 * Profile Routes - User profile management
 * 
 * protect middleware - JWT verification required for all routes
 * All profile operations require authentication
 */

import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const profileRouter = Router();

/**
 * GET /api/profile
 * Middleware: protect (JWT verification required)
 * Query params: ?userId=<id> (admin can request other users' profiles)
 * Response: { firstName, lastName, email, phone, department, ... }
 * Description: Retrieves authenticated user's profile or any user if admin
 */
profileRouter.get("/", protect, getProfile);

/**
 * POST /api/profile
 * Middleware: protect (JWT verification required)
 * Request: { bio (or other profile fields) }
 * Response: { success: true }
 * Description: Updates authenticated user's profile information
 */
profileRouter.post("/", protect, updateProfile);

export default profileRouter;
