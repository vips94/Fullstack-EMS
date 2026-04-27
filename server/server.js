import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payslipRouter from "./routes/payslipRoutes.js";
import dashbaordRouter from "./routes/dashboardRoute.js";

const app = express(); //create instance of express
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors()); //all the request will be parsed using this
app.use(express.json()); //all request will be parsed using json format
app.use(multer().none()); //multer is use for parsing form data

//Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRoute);
app.use("/api/leave", leaveRoutes);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashbaord", dashbaordRouter);

// start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`server is listening to port ${PORT}`));
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
