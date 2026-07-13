import bcrypt from "bcrypt";
import sequelize from "../src/config/db.js";
import "../src/models/index.js";
import Admin from "../src/models/Admin.js";

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const name = process.env.NAME;

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

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
