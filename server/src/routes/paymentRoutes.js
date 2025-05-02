import express from "express";
import { getAllPayments, extendMembershipValidity } from "../controllers/paymentController.js"

const router = express.Router()

router.get('/', getAllPayments)
router.post('/extend/:userId', extendMembershipValidity)

export default router
