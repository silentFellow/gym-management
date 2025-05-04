import express from "express";
import {
  getAllPayments,
  extendMembership,
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getAllPayments);
router.post("/extend-membership", extendMembership);
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;
