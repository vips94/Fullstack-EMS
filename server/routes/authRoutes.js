/**
 * Auth Routes - User authentication and session management
 * 
 * protect middleware - JWT verification middleware
 * - Validates Authorization header bearer token
 * - Extracts user session data from JWT payload
 */

import { Router } from "express";
import { changePassword, login, session } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

/**
 * POST /api/auth/login
 * No middleware required (public endpoint)
 * Request: { email, password }
 * Response: { token, user }
 * Description: Authenticates user with email/password, returns JWT token
 */
authRouter.post("/login", login);

/**
 * GET /api/auth/session
 * Middleware: protect (JWT verification required)
 * Response: { userId, email, role }
 * Description: Returns current authenticated user's session data
 */
authRouter.get("/session", protect, session);

/**
 * POST /api/auth/change-password
 * Middleware: protect (JWT verification required)
 * Request: { currentPassword, newPassword }
 * Response: { success: true }
 * Description: Changes password for authenticated user
 */
authRouter.post("/change-password", protect, changePassword);

export default authRouter;
