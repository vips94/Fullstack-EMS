/**
 * Authentication Middleware Module
 * Uses jwt (JSON Web Tokens) for authentication and authorization
 * jwt.verify() - Verifies and decodes JWT tokens
 */

import jwt from "jsonwebtoken"; // JWT library for token generation and verification

/**
 * protect - Middleware to verify JWT authentication token
 * Extracts Bearer token from Authorization header
 * Verifies token using JWT_SECRET and attaches decoded session to request
 * 
 * jwt.verify(token, secret) - Validates token signature and returns decoded payload
 * If token is invalid/expired, throws error
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Get Authorization header
    
    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    
    // jwt.verify() - Verifies token signature and decodes payload
    // Throws error if token is invalid or expired
    const session = jwt.verify(token, process.env.JWT_SECRET);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach decoded session data to request object for use in route handlers
    req.session = session;
    next(); // Pass control to next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * portectAdmin - Middleware to verify admin role (NOTE: typo in function name "portech")
 * Checks if authenticated user has "ADMIN" role
 * Called after protect() middleware to ensure token is valid
 */
export const portectAdmin = (req, res, next) => {
  // Verify that session role is "ADMIN"
  if (req?.session?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next(); // Allow admin user to proceed
};
