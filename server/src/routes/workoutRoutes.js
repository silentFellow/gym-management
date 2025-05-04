import express from "express";
import {
  createWorkout,
  getTrainerWorkouts,
  markWorkoutCompleted,
  getUserAssignedWorkouts,
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/create", createWorkout);
router.get("/trainer", getTrainerWorkouts);
router.post("/complete", markWorkoutCompleted);
router.get("/user", getUserAssignedWorkouts);

export default router;
