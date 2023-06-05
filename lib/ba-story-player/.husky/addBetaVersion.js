import { writeFileSync, readFileSync } from "fs";
const packageInfo = JSON.parse(readFileSync("./package.json").toString());
const newPackageInfo = { ...packageInfo };
const currentVersion = packageInfo.version;
if (currentVersion.includes("beta")) {
  /beta/;
  let betaNum = Number(currentVersion.replace(/.*beta(.*)/, "$1"));
  newPackageInfo.version = currentVersion.replace(
    /beta.*/,
    `beta${betaNum + 1}`
  );
  writeFileSync(
    "./package.json",
    JSON.stringify(newPackageInfo, null, 2) + "\n"
  );
}
