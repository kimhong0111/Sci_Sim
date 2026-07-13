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
    sim_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    parameter: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { tableName: "sim_config", freezeTableName: true, timestamps: false }
);

export default Simulation_Config;
