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

// ✅ Only import after dotenv.config()
import "./config/passport.js";

connectDB();

const app = express();

// ✅ Security middleware first
app.use(helmet());
app.use(compression());

// ✅ CORS middleware must come before routes
app.use(cors({
  origin: 'https://zentrack-rust.vercel.app/', // Your Vite frontend URL
  credentials: true, // Important for sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

// ✅ Session middleware (must come before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Important for cross-origin requests
      httpOnly: true
    }
  })
);

// ✅ Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("ZenTrack API is running...");
});

// ✅ Auth status endpoint
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
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
});

// ✅ User data endpoint
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// ✅ Auth routes
app.get("/auth/google", passport.authenticate("google", { 
  scope: ["profile", "email"] 
}));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "https://zentrack-rust.vercel.app/login?error=auth_failed",
    failureMessage: true 
  }),
  (req, res) => {
    // Successful authentication - redirect to frontend dashboard
    res.redirect("https://zentrack-rust.vercel.app/dashboard?oauth_success=true");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

// API routes
app.use("/api/habits", habits);
app.use("/api/entries", entries);

app.get("/api/me", ensureAuth, (req, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));