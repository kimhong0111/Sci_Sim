import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "science-sim-secret-key-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET + "-refresh";

export function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    JWT_SECRET,
    { expiresIn: "5m" }
  );
}

export function generateRefreshToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

const ACTION_SECRET = process.env.ACTION_SECRET || JWT_SECRET + "-action";

export function generateActionToken(admin, action) {
  return jwt.sign(
    { id: admin.id, email: admin.email, type: "action", action },
    ACTION_SECRET,
    { expiresIn: "30s" }
  );
}

export function verifyActionToken(token, expectedAction) {
  const payload = jwt.verify(token, ACTION_SECRET);
  if (payload.type !== "action" || payload.action !== expectedAction) {
    throw new Error("Invalid action token");
  }
  return payload;
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    const token = header.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.split(" ")[1]);
    } catch {}
  }
  next();
}
