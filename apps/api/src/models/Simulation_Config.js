import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Simulation_Config = sequelize.define(
  "Simulation_Config",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    simulation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    parameters: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { tableName: "simulation_configs", freezeTableName: true, timestamps: false }
);

export default Simulation_Config;
