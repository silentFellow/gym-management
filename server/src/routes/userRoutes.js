import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

export default router;
