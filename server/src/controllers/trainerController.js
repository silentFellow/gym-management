import User from "../models/user.js";

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" });
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trainers" });
  }
};

export const assignTraineeToTrainer = async (req, res) => {
  const { trainerId, memberId } = req.body;

  if (!trainerId || !memberId) {
    return res.status(400).json({ error: "Missing trainerId or memberId" });
  }

  try {
    const trainer = await User.findById(trainerId);
    const member = await User.findById(memberId);

    if (!trainer || trainer.role !== "trainer") {
      return res.status(400).json({ error: "Invalid trainer" });
    }

    if (
      !member ||
      member.role !== "member" ||
      !member.membershipExpiresAt ||
      member.membershipExpiresAt <= new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired member" });
    }

    if (trainer.trainees.includes(member._id)) {
      return res.status(400).json({ error: "Member already assigned" });
    }

    trainer.trainees.push(member._id);
    await trainer.save();

    res
      .status(200)
      .json({ success: true, message: "Member assigned to trainer" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assignment failed" });
  }
};

export const getTraineesForTrainer = async (req, res) => {
  try {
    const trainerId = req.query.trainerId;

    if (!trainerId) {
      return res.status(400).json({ error: "Trainer ID is required" });
    }

    const trainer = await User.findById(trainerId).populate('trainees');

    if (!trainer || trainer.role !== "trainer") {
      return res.status(403).json({ error: "Unauthorized or invalid trainer" });
    }

    const trainees = trainer.trainees.map((trainee) => {
      // Calculate attendance percentage for each trainee
      const totalAttendance = trainee.attendance?.length || 0;
      const presentAttendance = trainee.attendance?.filter(
        (a) => a.status === "Present"
      ).length || 0;

      const attendancePercentage = totalAttendance === 0
        ? 0
        : Math.round((presentAttendance / totalAttendance) * 100);

      return {
        id: trainee._id,
        username: trainee.username,
        attendancePercentage,
        attendance: trainee.attendance,
      };
    });

    res.status(200).json(trainees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainees" });
  }
};
