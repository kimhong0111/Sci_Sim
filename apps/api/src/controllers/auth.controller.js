import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";
import { generateToken, generateRefreshToken, verifyRefreshToken, generateActionToken, verifyActionToken } from "../middleware/auth.js";

const isProduction = process.env.NODE_ENV === "production";

export async function register(req, res) {
  try {
    if (req.user.id !== 1) {
      return res.status(403).json({ success: false, message: "Only the super-admin can create new admins" });
    }

    const { name, email, password, action_token } = req.body;

    if (!action_token) {
      return res.status(401).json({ success: false, message: "Re-authentication required" });
    }

    try {
      verifyActionToken(action_token, "create_admin");
    } catch {
      return res.status(401).json({ success: false, message: "Re-authentication expired, please try again" });
    }

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const pass = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, pass });

    const token = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      token,
      user: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("[register]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verifyPassword(req, res) {
  try {
    const { password, action } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (!action) {
      return res.status(400).json({ success: false, message: "Action is required" });
    }

    const admin = await Admin.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const valid = await bcrypt.compare(password, admin.pass);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const action_token = generateActionToken(admin, action);
    return res.status(200).json({ success: true, action_token });
  } catch (err) {
    console.error("[verifyPassword]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, admin.pass);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      token,
      user: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function listAdmins(req, res) {
  try {
    if (req.user.id !== 1) {
      return res.status(403).json({ success: false, message: "Only the super-admin can list admins" });
    }

    const admins = await Admin.findAll({
      attributes: ["id", "name", "email"],
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
    const admin = await Admin.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, user: admin });
  } catch (err) {
    console.error("[me]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old password and new password are required" });
    }

    const admin = await Admin.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const valid = await bcrypt.compare(oldPassword, admin.pass);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const pass = await bcrypt.hash(newPassword, 10);
    await admin.update({ pass });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("[changePassword]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteAdmin(req, res) {
  try {
    if (req.user.id !== 1) {
      return res.status(403).json({ success: false, message: "Only the super-admin can delete admins" });
    }

    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json({ success: false, message: "Re-authentication required" });
    }

    try {
      verifyActionToken(action_token, "delete_admin");
    } catch {
      return res.status(401).json({ success: false, message: "Re-authentication expired, please try again" });
    }

    const targetId = parseInt(req.params.id, 10);
    if (targetId === 1) {
      return res.status(403).json({ success: false, message: "Cannot delete the super-admin account" });
    }

    const admin = await Admin.findByPk(targetId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await admin.destroy();
    return res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    console.error("[deleteAdmin]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      res.clearCookie("refreshToken");
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const admin = await Admin.findByPk(payload.id);
    if (!admin) {
      res.clearCookie("refreshToken");
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    const token = generateToken(admin);
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("[refresh]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("refreshToken");
  return res.status(200).json({ success: true, message: "Logged out" });
}
