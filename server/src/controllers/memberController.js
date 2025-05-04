import User from "../models/user.js";
import Workout from "../models/workout.js";

export const getMemberDashboardData = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID missing" });

  try {
    const assignedWorkouts = await Workout.find({ assignedTrainees: userId });
    const completedWorkouts = assignedWorkouts.filter((w) =>
      w.completedBy.includes(userId),
    );

    const user = await User.findById(userId);
    const totalDays = user.attendance.length;
    const presentDays = user.attendance.filter(
      (a) => a.status === "Present",
    ).length;

    return res.json({
      user,
      attendance: { totalDays, presentDays },
      workouts: {
        assigned: assignedWorkouts.length,
        completed: completedWorkouts.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
