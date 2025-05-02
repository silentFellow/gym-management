import User from "../models/user.js";

export const getAllPayments = async (req, res) => {
  try {
    const users = await User.find({}, "username hasPaid membershipExpiresAt role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const extendMembership = async (req, res) => {
  const { userId, duration } = req.body

  try {
    // Find the user in the database
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get current membership expiry or set to now if not set
    const currentExpiry = user.membershipExpiresAt
      ? new Date(user.membershipExpiresAt)
      : new Date()

    // Add the duration to the current expiry
    const newExpiry = new Date(currentExpiry)
    newExpiry.setMonth(newExpiry.getMonth() + parseInt(duration)) // Add months

    // Update the user with the new expiry date
    user.membershipExpiresAt = newExpiry
    await user.save()

    return res.status(200).json({ message: 'Membership extended successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to extend membership', error })
  }
}
