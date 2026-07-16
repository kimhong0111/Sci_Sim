import { Topic } from "../models/index.js";
import { verifyActionToken } from "../middleware/auth.js";

export async function getAllTopics(req, res) {
  try {
    const where = {};
    if (req.query.mine === "true" && req.user) {
      where.created_by = req.user.id;
    }
    const data = await Topic.findAll({ where, order: [["name", "ASC"]] });
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getAllTopics]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function createTopic(req, res) {
  try {
    const { name, subject_id, action_token } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!subject_id) {
      return res.status(400).json({ message: "subject_id is required" });
    }
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "create_topic");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const topic = await Topic.create({ name: name.trim(), subject_id, created_by: req.user.id });
    return res.status(201).json(topic);
  } catch (err) {
    console.error("[createTopic]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTopic(req, res) {
  try {
    const { id } = req.params;
    const { name, subject_id, action_token } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!subject_id) {
      return res.status(400).json({ message: "subject_id is required" });
    }
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "update_topic");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    await topic.update({ name: name.trim(), subject_id });
    return res.status(200).json(topic);
  } catch (err) {
    console.error("[updateTopic]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTopic(req, res) {
  try {
    const { id } = req.params;
    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json({ message: "Re-authentication required" });
    }
    try {
      verifyActionToken(action_token, "delete_topic");
    } catch {
      return res.status(401).json({ message: "Re-authentication expired, please try again" });
    }
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    await topic.destroy();
    return res.status(200).json({ message: "Topic deleted successfully" });
  } catch (err) {
    console.error("[deleteTopic]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
