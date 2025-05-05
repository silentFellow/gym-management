import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15h" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// POST /users/create
export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ username, password, role: "member" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /users/login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.status(200).json({
        id: user._id,
        username: user.username,
        role: user.role,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token)
    return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id); // Optional: rotate token

    res.status(200).json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    // Map through the results to rename _id to id
    const modifiedUsers = users.map((user) => ({
      ...user,
      id: user._id.toString(), // Convert ObjectId to string
      _id: undefined,
    }));

    res.status(200).json(modifiedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    res.status(200).json({ ...user, id: user._id.toString(), _id: undefined });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Remove a user
export const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing user", error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ["member", "trainer", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role, isTrainer: role === "trainer" },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating role", error: error.message });
  }
};

export const getEligibleUsers = async (req, res) => {
  try {
    const today = new Date();
    const users = await User.find({
      role: "member",
      membershipExpiresAt: { $gt: today },
    }).select("_id username role membershipExpiresAt");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching eligible users:", error);
    res
      .status(500)
      .json({ message: "Error fetching eligible users", error: error.message });
  }
};
