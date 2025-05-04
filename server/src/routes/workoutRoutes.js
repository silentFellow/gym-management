import express from "express";
import {
  createWorkout,
  getTrainerWorkouts,
  getAssignedWorkouts,
  markWorkoutCompleted,
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/create", createWorkout);
router.get("/trainer", getTrainerWorkouts);
router.get("/assigned", getAssignedWorkouts);
router.post("/mark-complete", markWorkoutCompleted);

export default router;
