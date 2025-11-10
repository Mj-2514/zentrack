import express from "express";
import Entry from "../models/Entry.js";

const router = express.Router();

// Create entry
router.post("/", async (req, res) => {
  const entry = await Entry.create(req.body);
  res.status(201).json(entry);
});

// Get entries by habit
router.get("/:habitId", async (req, res) => {
  const entries = await Entry.find({ habitId: req.params.habitId });
  res.status(200).res.json(entries);
});

export default router;
