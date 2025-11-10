import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  goal: { type: String },
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Habit", habitSchema);
