import { Subject } from "../models/index.js";
import { verifyActionToken } from "../middleware/auth.js";

export async function getAllSubjects(req, res) {
  try {
    const where = {};
    if (req.query.mine === "true" && req.user) {
      where.created_by = req.user.id;
    }
    const data = await Subject.findAll({ where, order: [["name", "ASC"]] });
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getAllSubjects]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createSubject(req, res) {
  try {
    const { name, action_token } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "create_subject");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const subject = await Subject.create({ name: name.trim(), created_by: req.user.id });
    return res.status(201).json(subject);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Subject already exists" });
    }
    console.error("[createSubject]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateSubject(req, res) {
  try {
    const { id } = req.params;
    const { name, action_token } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "update_subject");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    await subject.update({ name: name.trim() });
    return res.status(200).json(subject);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Subject already exists" });
    }
    console.error("[updateSubject]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteSubject(req, res) {
  try {
    const { id } = req.params;
    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "delete_subject");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    await subject.destroy();
    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("[deleteSubject]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
