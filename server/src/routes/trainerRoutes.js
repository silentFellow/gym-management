import express from "express";
import {
  getAllTrainers,
  assignTraineeToTrainer,
} from "../controllers/trainerController.js";

const router = express.Router();

router.get("/", getAllTrainers);
router.post("/assign", assignTraineeToTrainer);

export default router;
