import { execSync } from "child_process";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const DATE = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
const BACKUP_DIR = join(__dirname, "backups");
const FILENAME = `science_sim_backup_${DATE}.sql`;

mkdirSync(BACKUP_DIR, { recursive: true });

const cmd = [
  "mariadb-dump",
  `-h ${process.env.DB_HOST}`,
  `-P ${process.env.DB_PORT}`,
  `-u ${process.env.DB_BACKUP_USER}`,
  `-p${process.env.DB_BACKUP_PASSWORD}`,
  `--ssl`,
  `--ssl-ca=${join(__dirname, "ca.pem")}`,
  "--single-transaction",
  "--routines",
  "--triggers",
  process.env.DB_NAME,
  `> ${join(BACKUP_DIR, FILENAME)}`
].join(" ");

console.log("Starting backup...");
execSync(cmd, { stdio: "inherit" });
console.log(`Backup saved: ${join(BACKUP_DIR, FILENAME)}`);
