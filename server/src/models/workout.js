import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    assignedTrainees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model("Workout", workoutSchema);
