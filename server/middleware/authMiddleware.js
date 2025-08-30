import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user id and role to req.user
    req.user = { id: decoded.id, role: decoded.role };

    // Optionally fetch fresh user data
    try {
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user.profile = user;
    } catch (e) {
      // Ignore, not critical
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin access only" });
  next();
}
