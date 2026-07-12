import { Topic } from "../models/index.js";

export async function getAllTopics(req, res) {
  try {
    const data = await Topic.findAll({ order: [["name", "ASC"]] });
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getAllTopics]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createTopic(req, res) {
  try {
    const { name, subject_id } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!subject_id) {
      return res.status(400).json({ message: "subject_id is required" });
    }
    const topic = await Topic.create({ name: name.trim(), subject_id });
    return res.status(201).json(topic);
  } catch (err) {
    console.error("[createTopic]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
