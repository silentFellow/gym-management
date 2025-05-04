import Razorpay from "razorpay";
import path from "path";
import dotenv from "dotenv";
import User from "../models/user.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const getAllPayments = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "username hasPaid membershipExpiresAt role",
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const extendMembership = async (req, res) => {
  const { userId, duration } = req.body;

  try {
    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get current membership expiry or set to now if not set
    const currentExpiry = user.membershipExpiresAt
      ? new Date(user.membershipExpiresAt)
      : new Date();

    // Add the duration to the current expiry
    const newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + parseInt(duration)); // Add months

    // Update the user with the new expiry date
    user.membershipExpiresAt = newExpiry;
    await user.save();

    return res
      .status(200)
      .json({ message: "Membership extended successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to extend membership", error });
  }
};

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount } = req.body;
  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    periodInDays,
  } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const membershipExpiresAt = new Date(
      Date.now() + periodInDays * 24 * 60 * 60 * 1000,
    );
    await User.findByIdAndUpdate(userId, { membershipExpiresAt });
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, error: "Invalid signature" });
};
