import User from "../models/user.js";

export const getAllAttendanceSummaries = async (req, res) => {
  try {
    const users = await User.find({ role: "member" });

    const attendanceData = users.map((user) => {
      const totalSessions = user.attendance.length;
      const attendedSessions = user.attendance.filter(
        (record) => record.status === "Present",
      ).length;

      const attendancePercentage =
        totalSessions > 0
          ? ((attendedSessions / totalSessions) * 100).toFixed(2)
          : 0;

      return {
        id: user._id,
        username: user.username,
        attendancePercentage,
      };
    });

    return res.status(200).json(attendanceData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch attendance summaries", error });
  }
};

export const getUserAttendance = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user || user.role !== "member") {
      return res.status(404).json({ message: "User not found" });
    }

    const totalSessions = user.attendance.length;
    const attendedSessions = user.attendance.filter(
      (record) => record.status === "Present",
    ).length;

    const attendancePercentage =
      totalSessions > 0
        ? ((attendedSessions / totalSessions) * 100).toFixed(2)
        : 0;

    return res.status(200).json({
      username: user.username,
      attendancePercentage,
      attendanceRecords: user.attendance, // array of {date, status}
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user attendance data",
      error,
    });
  }
};

export const markAttendance = async (req, res) => {
  const { trainerId, traineeId, status } = req.body;

  // Validate payload
  if (!trainerId || !traineeId || !["present", "absent"].includes(status)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    // Find the trainer (user) in the database
    const trainer = await User.findById(trainerId);
    if (!trainer) return res.status(404).json({ error: "Trainer not found" });

    const trainee = await User.findById(traineeId);
    if (!trainee) return res.status(404).json({ error: "Trainee not found" });

    // Check if the trainer is assigned to this trainee
    if (!trainer.trainees || !trainer.trainees.includes(traineeId)) {
      return res
        .status(403)
        .json({ error: "Trainer is not assigned to this trainee" });
    }

    // Mark the attendance
    trainee.attendance.push({
      date: new Date(),
      status: status === "present" ? "Present" : "Absent",
    });

    await trainee.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};
