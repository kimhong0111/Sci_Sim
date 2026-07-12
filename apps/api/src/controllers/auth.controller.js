import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { generateToken } from "../middleware/auth.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash,
      role: "admin",
    });

    const token = generateToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[register]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function listAdmins(req, res) {
  try {
    const admins = await User.findAll({
      where: { role: "admin" },
      attributes: ["id", "name", "email", "role"],
      order: [["id", "DESC"]],
    });
    return res.status(200).json(admins);
  } catch (err) {
    console.error("[listAdmins]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("[me]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
