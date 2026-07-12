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
