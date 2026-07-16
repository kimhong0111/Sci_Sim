import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import "./models/index.js";
import Admin from "./models/Admin.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_ADMIN_USER,
  process.env.DB_ADMIN_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const name = process.env.NAME;

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected (sci_admin)");

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const pass = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, pass });

    console.log(`Admin created — email: ${email}, password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
