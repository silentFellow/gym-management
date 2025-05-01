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
        _id: user._id,
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
