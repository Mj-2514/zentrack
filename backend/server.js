import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import connectDB from "./config/db.js";
import habits from "./routes/habits.js";
import entries from "./routes/entries.js";
import { ensureAuth } from "./middleware/authMiddleware.js";

dotenv.config();
import "./config/passport.js";

// ===== CONNECT DB =====
connectDB();

const app = express();

// ===== SECURITY =====
app.use(helmet());
app.use(compression());

// ===== CORS =====
// backend = Render
// frontend = Vercel
app.use(
  cors({
    origin: "https://zentrack-rust.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// ===== SESSIONS =====
// Render uses HTTPS → secure: true required
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        // HTTPS → must be true
      httpOnly: true,
      sameSite: "none",    // required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ===== PASSPORT =====
app.use(passport.initialize());
app.use(passport.session());

// ===== BASE ROUTE =====
app.get("/", (req, res) => {
  res.send("ZenTrack API is running...");
});

// ===== AUTH STATUS =====
app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

// ===== USER DATA =====
app.get("/auth/user", ensureAuth, (req, res) => {
  res.json(req.user);
});

// ===== GOOGLE AUTH =====
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// IMPORTANT:
// Replace YOUR_RENDER_URL with the REAL one if different.
const BACKEND_URL = "https://zentrack.onrender.com";
const FRONTEND_URL = "https://zentrack-rust.vercel.app";

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/dashboard?oauth_success=true`);
  }
);

// ===== LOGOUT =====
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

// ===== API ROUTES =====
app.use("/api/habits", habits);
app.use("/api/entries", entries);

app.get("/api/me", ensureAuth, (req, res) => {
  res.json(req.user);
});

// ===== PORT =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
