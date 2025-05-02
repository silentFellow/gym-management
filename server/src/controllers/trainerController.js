import User from "../models/user.js";

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" });
    console.log(trainers);
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
