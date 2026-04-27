import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";

const dashbaordRouter = Router();

dashbaordRouter.get("/", protect, getDashboard);

export default dashbaordRouter;
