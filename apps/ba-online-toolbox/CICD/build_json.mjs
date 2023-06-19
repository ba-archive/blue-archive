import chalk from 'chalk';
import fs from 'fs';
import jsYaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        const pathname = path.join(dir, file);
        fs.stat(pathname, (err, stats) => {
          if (err) {
            console.log(err);
          } else if (stats.isDirectory()) {
            walk(pathname, callback);
          } else {
            callback(pathname);
          }
        });
      });
    }
  });
}

walk(path.resolve(__dirname, '..', 'public'), pathname => {
  const startTime = new Date().getTime();
  fs.readFile(pathname, 'utf8', (err, data) => {
    if (err) {
      console.log(`[${chalk.red('ERROR')}] ${pathname}\n${chalk.red(err)}`);
    } else {
      if (/\.ya?ml$/i.test(pathname)) {
        const json = jsYaml.load(data);
        const jsonPath = pathname.replaceAll(/ya?ml/gi, 'json');
        const jsonDir = path.dirname(jsonPath);
        if (undefined !== json) {
          if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
          }
          fs.writeFile(jsonPath, JSON.stringify(json, null, 0), err => {
            if (err) {
              console.log(
                `[${chalk.red('FAILED')}] ${jsonPath}: ${chalk.red(err)}`
              );
            } else {
              const endTime = new Date().getTime();
              console.log(
                `[${chalk.green('SUCCESS')}] ${chalk.green(
                  jsonPath
                )} ${chalk.gray(`${endTime - startTime}ms`)}`
              );
            }
          });
        } else {
          console.log(
            `[${chalk.yellowBright('SKIPPED')}] ${pathname} (empty file)`
          );
        }
      } else {
        console.log(
          `[${chalk.gray('IGNORED')}] ${chalk.gray(pathname + ' (not YAML)')}`
        );
      }
    }
  });
});
