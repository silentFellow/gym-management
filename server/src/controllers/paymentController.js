import User from "../models/user.js";

export const getAllPayments = async (req, res) => {
  try {
    const users = await User.find({}, "username hasPaid membershipExpiresAt role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const extendMembershipValidity = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date();
    user.membershipExpiresAt =
      user.membershipExpiresAt && user.membershipExpiresAt > today
        ? new Date(
            user.membershipExpiresAt.setMonth(
              user.membershipExpiresAt.getMonth() + 1,
            ),
          )
        : new Date(today.setMonth(today.getMonth() + 1));

    user.hasPaid = true;
    await user.save();
    res.json({ message: "Membership extended", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to extend membership" });
  }
};
