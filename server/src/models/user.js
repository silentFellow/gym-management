import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["member", "trainer", "admin"],
    default: "member",
  },
  membershipExpiresAt: {
    type: Date,
    required: false,
  },
  isTrainer: {
    type: Boolean,
    default: false,
  },
  trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Encrypt password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// You can create a pre-save hook to auto-set the isTrainer field based on role
userSchema.pre("save", function (next) {
  if (this.role === "trainer") {
    this.isTrainer = true;
  } else {
    this.isTrainer = false;
  }
  next();
});

export default mongoose.model("User", userSchema);
