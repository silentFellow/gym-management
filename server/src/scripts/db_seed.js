import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists. Skipping seeding.");
      process.exit();
    }

    const user = new User({
      username: "admin",
      password: "admin",
      role: "admin",
    });

    await user.save();
    process.exit();
  } catch (error) {
    console.log("Error connecting to database:", error);
    process.exit(1);
  }
};

seedData();
