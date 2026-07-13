import { Subject } from "../models/index.js";

export async function getAllSubjects(req, res) {
  try {
    const data = await Subject.findAll({ order: [["name", "ASC"]] });
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getAllSubjects]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createSubject(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
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
