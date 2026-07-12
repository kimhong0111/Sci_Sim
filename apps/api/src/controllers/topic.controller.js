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
