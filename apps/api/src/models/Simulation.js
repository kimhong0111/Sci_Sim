import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Simulation = sequelize.define(
  "Simulation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
    },
    sketch_key: {
      type: DataTypes.STRING,
    }
  },
  { tableName: "simulations", freezeTableName: true, timestamps: false }
);

export default Simulation;