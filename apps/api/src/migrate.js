import sequelize from "./config/db.js";

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    console.log("No pending migrations — all columns are in schema.sql");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
