import chalk from "chalk";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");

const currentBuild = dayjs().tz("Asia/Shanghai").format("YYYYMMDDHHmmss");

console.log(currentBuild);

const versionFile = path.resolve(publicDir, "version.json");

console.log(chalk.green(`Current build is ${currentBuild}`));
console.log(chalk.green(`Write version to ${versionFile}`));
fs.writeFileSync(
  versionFile,
  JSON.stringify({ build: currentBuild, timezone: "Asia/Shanghai" })
);
