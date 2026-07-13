import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "subjects", freezeTableName: true, timestamps: false }
);

export default Subject;
