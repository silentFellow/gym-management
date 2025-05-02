import express from "express";
import { getAllPayments, extendMembership } from "../controllers/paymentController.js"

const router = express.Router()

router.get('/', getAllPayments)
router.post('/extend-membership', extendMembership)

export default router
