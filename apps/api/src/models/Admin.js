import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "admin", freezeTableName: true, timestamps: false }
);

export default Admin;
