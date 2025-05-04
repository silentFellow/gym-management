import Workout from "../models/workout.js";
import User from "../models/user.js";

export const createWorkout = async (req, res) => {
  const { trainerId, title, description } = req.body;

  if (!trainerId)
    return res.status(400).json({ message: "Trainer ID is required" });

  const trainer = await User.findById(trainerId);
  if (!trainer || !trainer.isTrainer)
    return res.status(404).json({ message: "Trainer not found" });

  const trainees = await User.find({ _id: { $in: trainer.trainees } });

  const workout = await Workout.create({
    trainerId,
    title,
    description,
    assignedTrainees: trainees.map((t) => t._id),
    completedBy: [],
  });

  res.status(201).json(workout);
};

export const getTrainerWorkouts = async (req, res) => {
  const { trainerId } = req.query;

  const workouts = await Workout.find({ trainerId }).populate(
    "assignedTrainees completedBy",
  );
  res.json(workouts);
};

export const markWorkoutCompleted = async (req, res) => {
  const { userId, workoutId } = req.body;

  const workout = await Workout.findById(workoutId);
  if (!workout) return res.status(404).json({ message: "Workout not found" });

  if (!workout.completedBy.includes(userId)) {
    workout.completedBy.push(userId);
    await workout.save();
  }

  res.json({ message: "Marked as completed" });
};

export const getUserAssignedWorkouts = async (req, res) => {
  const { userId } = req.query;

  const workouts = await Workout.find({ assignedTrainees: userId });
  res.json(workouts);
};
