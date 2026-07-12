import bcrypt from "bcrypt";
import sequelize from "./config/db.js";
import "./models/index.js";
import User from "./models/User.js";

const email = process.env.EMAIL 
const password = process.env.PASSWORD 
const name = process.env.NAME

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password_hash,
      role: "admin",
    });

    console.log(`Admin created — email: ${email}, password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
