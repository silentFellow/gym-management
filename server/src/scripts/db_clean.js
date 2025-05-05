import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.js";
import Workout from "../models/workout.js";

dotenv.config();

const cleanDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    console.log("Database cleaned successfully.");
    process.exit();
  } catch (error) {
    console.error("Error cleaning database:", error);
    process.exit(1);
  }
};

cleanDatabase();
