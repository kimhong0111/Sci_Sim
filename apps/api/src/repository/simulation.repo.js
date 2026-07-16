import { Simulation, Subject, Topic, Simulation_Config } from "../models/index.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

async function uploadToCloudinary(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "simulations",
  });
  fs.unlinkSync(filePath);
  return result.secure_url;
}

async function deleteFromCloudinary(url) {
  if (!url) return;
  const publicId = url.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(`simulations/${publicId}`);
}


export async function fetchSimulationAndTransform(where = {}) {

    const simulations = await Simulation.findAll({
        where,
        include: [
            { model: Subject, attributes: ["name"] },
            { model: Topic, attributes: ["name"] },
            { 
                model: Simulation_Config, 
                foreignKey: "sim_id", 
            },
        ],
    });
    if (!simulations || simulations.length === 0) return [];
    return simulations;
}

export async function fetchSimulationByIdAndTransform(id) {
    return await Simulation.findOne({
        where: { id },
        include: [
            { model: Subject, attributes: ["name"] },
            { model: Topic, attributes: ["name"] },
            { 
                model: Simulation_Config,
                foreignKey: "sim_id",  
            },
        ],
    });
}

export async function createSimulation(data, filePath) {
  if (filePath) {
    data.thumbnail_url = await uploadToCloudinary(filePath);
  }
  const configData = data.Simulation_Config;
  delete data.Simulation_Config;
  const simulation = await Simulation.create(data);
  if (configData) {
    const config = typeof configData === "string" ? JSON.parse(configData) : configData;
    const parameter = config.parameters || config.parameter || {};
    await Simulation_Config.create({ sim_id: simulation.id, parameter });
  }
  return fetchSimulationByIdAndTransform(simulation.id);
}

export async function updateSimulation(id, data, filePath, removeThumbnail) {
  const simulation = await Simulation.findByPk(id);
  if (!simulation) return null;
  if (filePath) {
    if (simulation.thumbnail_url) {
      await deleteFromCloudinary(simulation.thumbnail_url);
    }
    data.thumbnail_url = await uploadToCloudinary(filePath);
  } else if (removeThumbnail) {
    if (simulation.thumbnail_url) {
      await deleteFromCloudinary(simulation.thumbnail_url);
    }
    data.thumbnail_url = null;
  }
  const configData = data.Simulation_Config;
  delete data.Simulation_Config;
  await simulation.update(data);
  if (configData) {
    const config = typeof configData === "string" ? JSON.parse(configData) : configData;
    const parameter = config.parameters || config.parameter || {};
    await Simulation_Config.upsert({ sim_id: id, parameter });
  }
  return fetchSimulationByIdAndTransform(id);
}


export async function deleteSimulation(id) {
  const simulation = await Simulation.findByPk(id);
  if (!simulation) return false;
  if (simulation.thumbnail_url) {
    await deleteFromCloudinary(simulation.thumbnail_url);
  }
  await simulation.destroy();
  return true;
}



