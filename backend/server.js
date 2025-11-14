import express from "express";
import dotenv from "dotenv";
import { ensureAuth } from "./middleware/authMiddleware.js";
import compression from "compression";
import helmet from "helmet";

dotenv.config();

import cors from "cors";
import connectDB from "./config/db.js";
import habits from "./routes/habits.js";
import entries from "./routes/entries.js";
import session from "express-session";
import passport from "passport";

import "./config/passport.js";

connectDB();

const app = express();

// Security
app.use(helmet());
app.use(compression());

// CORS
app.use(
  cors({
    origin: "https://zentrack-rust.vercel.app", 
    credentials: true,
  })
);

app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,   // true if HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Base
app.get("/", (req, res) => {
  res.send("ZenTrack API is running...");
});

// === AUTH STATUS ===
app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

// === AUTH USER ===
app.get("/auth/user", ensureAuth, (req, res) => {
  res.json(req.user);
});

// === GOOGLE AUTH ===
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://zentrack-rust.vercel.app/login?error=auth_failed"
  }),
  (req, res) => {
    res.redirect("https://zentrack-rust.vercel.app/dashboard?oauth_success=true");
  }
);

// === LOGOUT ===
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

// === API ROUTES ===
app.use("/api/habits", habits);
app.use("/api/entries", entries);

app.get("/api/me", ensureAuth, (req, res) => {
  res.json(req.user);
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
