import * as repo from "../repository/simulation.repo.js"
import { verifyActionToken } from "../middleware/auth.js";

function createResponseMessage(success, message) {
  return { success, message };
}

export async function getAllSimulation(req, res) {
  try {
    const where = {};
    if (req.query.mine === "true" && req.user) {
      where.created_by = req.user.id;
    }
    const data = await repo.fetchSimulationAndTransform(where);
    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getAllSimulation]", err);
    return res
      .status(500)
      .json(createResponseMessage(false, "Internal Server Error"));
  }
}

export async function getSimulationById(req, res) {
  const { id } = req.params;
  try {
    const data = await repo.fetchSimulationByIdAndTransform(id);
    if (!data) {
      return res
        .status(404)
        .json(createResponseMessage(false, "No Simulation Found"));
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("[getSimulationById]", err);
    return res
      .status(500)
      .json(createResponseMessage(false, "Internal Server Error"));
  }
}

export async function createNewSimulation(req, res) {
  try {
    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json(createResponseMessage(false, "Re-authentication required"));
    }
    try {
      verifyActionToken(action_token, "create_simulation");
    } catch {
      return res.status(401).json(createResponseMessage(false, "Re-authentication expired, please try again"));
    }
    const filePath = req.file?.path;
    req.body.created_by = req.user.id;
    delete req.body.action_token;
    const data = await repo.createSimulation(req.body, filePath);
    return res.status(201).json(data);
  } catch (err) {
    console.error("[createNewSimulation]", err);
    return res
      .status(500)
      .json(createResponseMessage(false, "Internal Server Error"));
  }
}

export async function updateExistingSimulation(req, res) {
  const { id } = req.params;
  try {
    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json(createResponseMessage(false, "Re-authentication required"));
    }
    try {
      verifyActionToken(action_token, "update_simulation");
    } catch {
      return res.status(401).json(createResponseMessage(false, "Re-authentication expired, please try again"));
    }
    const filePath = req.file?.path;
    const removeThumbnail = req.body.remove_thumbnail === "true" || req.body.remove_thumbnail === true;
    delete req.body.remove_thumbnail;
    delete req.body.action_token;
    const data = await repo.updateSimulation(id, req.body, filePath, removeThumbnail);
    if (!data) {
      return res
        .status(404)
        .json(createResponseMessage(false, "Simulation Not Found"));
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("[updateExistingSimulation]", err);
    return res
      .status(500)
      .json(createResponseMessage(false, "Internal Server Error"));
  }
}

export async function removeSimulation(req, res) {
  const { id } = req.params;
  try {
    const { action_token } = req.body;
    if (!action_token) {
      return res.status(401).json(createResponseMessage(false, "Re-authentication required"));
    }

    try {
      verifyActionToken(action_token, "delete_simulation");
    } catch {
      return res.status(401).json(createResponseMessage(false, "Re-authentication expired, please try again"));
    }

    const deleted = await repo.deleteSimulation(id);
    if (!deleted) {
      return res
        .status(404)
        .json(createResponseMessage(false, "Simulation Not Found"));
    }
    return res
      .status(200)
      .json(createResponseMessage(true, "Simulation Deleted"));
  } catch (err) {
    console.error("[removeSimulation]", err);
    return res
      .status(500)
      .json(createResponseMessage(false, "Internal Server Error"));
  }
}
