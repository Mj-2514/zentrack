import express from "express";
import Habit from "../models/Habit.js";

const router = express.Router();

// Create a new habit
router.post("/add", async (req, res) => {
  try {
    const { title, category, goal } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const habit = await Habit.create({ title, category, goal, slug });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all habits
router.get("/", async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

// Get habit by slug
router.get("/:slug", async (req, res) => {
  const habit = await Habit.findOne({ slug: req.params.slug });
  if (!habit) return res.status(404).json({ message: "Habit not found" });
  res.json(habit);
});

// Update habit
router.put("/:id", async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habit);
});

// Delete habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Habit deleted" });
});

export default router;
