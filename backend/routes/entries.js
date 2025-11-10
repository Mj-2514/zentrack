import express from "express";
import Entry from "../models/Entry.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create entry
router.post("/add", ensureAuth, async (req, res) => {
  try {
    console.log("Creating entry for user:", req.user._id);
    console.log("Entry body:", req.body);

    const entry = await Entry.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error("Error creating entry:", err);
    res.status(500).json({ message: "Server error creating entry" });
  }
});



// Get entries for the logged-in user
router.get("/all", ensureAuth, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user._id }); // only this user's entries
    res.status(200).json(entries);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ message: "Server error fetching entries" });
  }
});

// Get entries by habit for logged-in user
router.get("/:habitId", ensureAuth, async (req, res) => {
  try {
    const entries = await Entry.find({
      habitId: req.params.habitId,
      userId: req.user._id
    });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Error fetching entries by habit:", err);
    res.status(500).json({ message: "Server error fetching entries" });
  }
});

export default router;
