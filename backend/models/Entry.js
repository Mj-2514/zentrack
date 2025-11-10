import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
  date: { type: Date, default: Date.now },
  reflection: { type: String },
  mood: { type: String }
});

export default mongoose.model("Entry", entrySchema);
