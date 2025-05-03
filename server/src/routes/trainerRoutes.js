import express from "express";
import {
  getAllTrainers,
  getTraineesForTrainer,
  assignTraineeToTrainer,
} from "../controllers/trainerController.js";

const router = express.Router();

router.get("/", getAllTrainers);
router.get("/trainees", getTraineesForTrainer);
router.post("/assign", assignTraineeToTrainer);

export default router;
