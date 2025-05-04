import express from "express";
import { getMemberDashboardData } from "../controllers/memberController.js";

const router = express.Router();

router.get("/dashboard", getMemberDashboardData);

export default router
