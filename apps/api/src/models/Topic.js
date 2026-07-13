import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Topic = sequelize.define(
  "Topic",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "topics", freezeTableName: true, timestamps: false }
);

export default Topic;
