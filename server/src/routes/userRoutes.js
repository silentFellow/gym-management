import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getAllUsers,
  removeUser,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.delete("/:id", removeUser);
router.put("/:id", updateUserRole);

export default router;
