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
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "simulations", freezeTableName: true, timestamps: false }
);

export default Simulation;
