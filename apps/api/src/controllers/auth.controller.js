import bcrypt from "bcrypt";
import { Admin } from "../models/index.js";
import { generateToken } from "../middleware/auth.js";

export async function register(req, res) {
  try {
    if (req.user.id !== 1) {
      return res.status(403).json({ success: false, message: "Only the super-admin can create new admins" });
    }

    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const pass = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, pass });

    const token = generateToken(admin);
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
