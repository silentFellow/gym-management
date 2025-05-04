import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUser,
  getAllUsers,
  removeUser,
  updateUserRole,
  getEligibleUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.get("/eligible-members", getEligibleUsers);
router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.delete("/:id", removeUser);
router.put("/:id", updateUserRole);

export default router;
