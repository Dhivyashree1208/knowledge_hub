// server/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Refactored: Signup (previously Register)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: "user" });
    await user.save();
    res.json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});

// REMOVED: Login feature was here.
// router.post("/login", ...) 

export default router;