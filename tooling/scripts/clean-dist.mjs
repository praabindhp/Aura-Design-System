import { rmSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packagesRoot = join(repositoryRoot, "packages");
const packageRoot = resolve(process.cwd());

if (dirname(packageRoot) !== packagesRoot || basename(packageRoot).length === 0) {
  throw new Error(`Refusing to clean an unexpected package path: ${packageRoot}`);
}

rmSync(join(packageRoot, "dist"), { force: true, recursive: true });
