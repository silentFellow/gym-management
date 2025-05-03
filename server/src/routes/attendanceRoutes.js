import express from "express";
import {
  getAllAttendanceSummaries,
  getUserAttendance,
  markAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/summaries", getAllAttendanceSummaries);
router.get("/:userId", getUserAttendance);
router.post("/mark", markAttendance);

export default router;
