import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/check-health", async (req, res) => {
  res.status(200).send({ "status": "ok" })
})

app.use("/users", userRoutes);
app.use("/trainers", trainerRoutes);
app.use("/payments", paymentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/workouts", workoutRoutes);
app.use("/members", memberRoutes);

app.get("/", (req, res) => res.send("Gym Management API Running"));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
