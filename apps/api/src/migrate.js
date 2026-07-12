import sequelize from "./config/db.js";
import { QueryTypes } from "sequelize";

const migrations = [
  {
    column: "thumbnail_url",
    sql: "ALTER TABLE simulations ADD COLUMN thumbnail_url VARCHAR(500) AFTER description",
  },
  {
    column: "sketch_key",
    sql: "ALTER TABLE simulations ADD COLUMN sketch_key VARCHAR(255) AFTER thumbnail_url",
  },
];

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    for (const m of migrations) {
      const [result] = await sequelize.query(
        `SHOW COLUMNS FROM simulations LIKE '${m.column}'`,
        { type: QueryTypes.SELECT }
      );
      if (result) {
        console.log(`${m.column} column already exists — skipped`);
      } else {
        await sequelize.query(m.sql);
        console.log(`Added ${m.column} column to simulations table`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
