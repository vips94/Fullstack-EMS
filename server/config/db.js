/**
 * Database Connection Module
 * Uses mongoose library to connect to MongoDB database
 * mongoose.connect() - Establishes connection to MongoDB using URI from environment variable
 * mongoose.connection.on() - Event listener for connection status
 */

import mongoose from "mongoose"; // MongoDB ODM (Object Document Mapper) library

/**
 * connectDB - Async function to establish MongoDB connection
 * Validates MONGODB_URI environment variable before connecting
 * Uses try-catch for error handling
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set");
    }
    
    // Listen for successful connection event
    mongoose.connection.on("connected", () =>
      console.log("Database connected"),
    );
    
    // mongoose.connect() - Connects to MongoDB using URI
    // Returns a promise that resolves when connection is established
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
