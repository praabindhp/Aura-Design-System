import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  globSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const executable = (root, name) =>
  join(
    root,
    "node_modules",
    ".bin",
    `${name}${process.platform === "win32" ? ".cmd" : ""}`,
  );
const npmCli = process.env.npm_execpath ?? "npm";
const temporaryRoot = mkdtempSync(join(tmpdir(), "pads-package-check-"));
const tarballRoot = join(temporaryRoot, "tarballs");
const consumerRoot = join(temporaryRoot, "consumer");
const canonicalLicense = readFileSync(join(repositoryRoot, "LICENSE"), "utf8");
const environment = {
  ...process.env,
  npm_config_audit: "false",
  npm_config_cache: join(temporaryRoot, "npm-cache"),
  npm_config_fund: "false",
  npm_config_ignore_scripts: "true",
  npm_config_offline: "true",
  npm_config_package_lock: "false",
};
const packages = [
  { name: "tokens", profile: "strict" },
  { name: "react", profile: "esm-only" },
  { name: "charts", profile: "esm-only" },
  { name: "rich-content", profile: "esm-only" },
  { name: "testing", profile: "esm-only" },
];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

function validateOptionalPackageBoundary(packageName, cwd, manifest) {
  if (packageName !== "react") return;
  const optionalPackages = ["@praabindh/aura-charts", "@praabindh/aura-rich-content"];
  const runtimeDependencies = {
    ...manifest.dependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  };
  for (const optionalPackage of optionalPackages) {
    if (runtimeDependencies[optionalPackage]) {
      throw new Error(
        `${manifest.name} must not depend on optional runtime ${optionalPackage}.`,
      );
    }
  }

  const emittedJavaScript = globSync("dist/**/*.js", { cwd });
  for (const file of emittedJavaScript) {
    const source = readFileSync(join(cwd, file), "utf8");
    const leakedRuntime = optionalPackages.find((name) => source.includes(name));
    if (leakedRuntime) {
      throw new Error(
        `${file} unexpectedly references optional runtime ${leakedRuntime}.`,
      );
    }
  }
}

const parseVersion = (value) => {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(value);
  if (!match) throw new Error(`Unsupported peer version: ${value}.`);
  return match.slice(1).map(Number);
};

const compareVersions = (left, right) => {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
};

const satisfiesComparator = (version, comparator) => {
  const match = /^(>=|<=|>|<|=|\^|~)?(\d+)\.(\d+)\.(\d+)$/.exec(comparator);
  if (!match) throw new Error(`Unsupported peer comparator: ${comparator}.`);
  const operator = match[1] ?? "=";
  const expected = match.slice(2).map(Number);
  const comparison = compareVersions(version, expected);

  if (operator === ">=") return comparison >= 0;
  if (operator === "<=") return comparison <= 0;
  if (operator === ">") return comparison > 0;
  if (operator === "<") return comparison < 0;
  if (operator === "=") return comparison === 0;

  const upper = [...expected];
  if (operator === "~") upper[1] += 1;
  else if (expected[0] > 0) upper[0] += 1;
  else if (expected[1] > 0) upper[1] += 1;
  else upper[2] += 1;
  if (operator === "~" || expected[0] > 0) upper[2] = 0;
  if (operator === "^") {
    if (expected[0] > 0) upper[1] = 0;
    else if (expected[1] > 0) upper[2] = 0;
  }
  return comparison >= 0 && compareVersions(version, upper) < 0;
};

const satisfiesRange = (version, range) => {
  const parsed = parseVersion(version);
  return range
    .split("||")
    .map((candidate) => candidate.trim())
    .some((candidate) =>
      candidate.split(/\s+/u).every((part) => satisfiesComparator(parsed, part)),
    );
};

function validatePackedPeers(packedPackages, localDependencies) {
  const availableVersions = new Map(
    packedPackages.map(({ manifest }) => [manifest.name, manifest.version]),
  );
  for (const [name, { manifest }] of localDependencies) {
    availableVersions.set(name, manifest.version);
  }

  for (const { manifest } of packedPackages) {
    for (const [peer, range] of Object.entries(manifest.peerDependencies ?? {})) {
      if (manifest.peerDependenciesMeta?.[peer]?.optional) continue;
      const version = availableVersions.get(peer);
      if (!version) throw new Error(`${manifest.name} requires missing peer ${peer}.`);
      if (!satisfiesRange(version, range)) {
        throw new Error(
          `${manifest.name} requires ${peer}@${range}, but the packed consumer provides ${version}.`,
        );
      }
    }
  }
}

function collectLocalDependencies(packedPackages, fixtureManifest) {
  const packedNames = new Set(packedPackages.map(({ manifest }) => manifest.name));
  const names = new Set([
    ...Object.keys(fixtureManifest.dependencies ?? {}),
    ...Object.keys(fixtureManifest.devDependencies ?? {}),
  ]);
  for (const { manifest } of packedPackages) {
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      names.add(dependency);
    }
    for (const dependency of Object.keys(manifest.peerDependencies ?? {})) {
      if (!manifest.peerDependenciesMeta?.[dependency]?.optional) {
        names.add(dependency);
      }
    }
  }

  const localPackages = new Map();
  for (const name of names) {
    if (packedNames.has(name)) continue;
    const packageRoot = join(repositoryRoot, "node_modules", ...name.split("/"));
    if (!existsSync(join(packageRoot, "package.json"))) {
      throw new Error(
        `The packed consumer dependency ${name} is not installed at the repository root.`,
      );
    }
    localPackages.set(name, {
      manifest: readJson(join(packageRoot, "package.json")),
      packageRoot,
    });
    const { manifest } = localPackages.get(name);
    for (const peer of Object.keys(manifest.peerDependencies ?? {})) {
      if (!manifest.peerDependenciesMeta?.[peer]?.optional) names.add(peer);
    }
  }
  return localPackages;
}

function createPackedConsumer(packedPackages) {
  const fixtureRoot = join(repositoryRoot, "apps", "consumer-vite");
  const fixtureManifest = readJson(join(fixtureRoot, "package.json"));
  mkdirSync(consumerRoot, { recursive: true });
  cpSync(join(fixtureRoot, "src"), join(consumerRoot, "src"), {
    recursive: true,
  });
  copyFileSync(join(fixtureRoot, "index.html"), join(consumerRoot, "index.html"));
  copyFileSync(
    join(fixtureRoot, "vite.config.ts"),
    join(consumerRoot, "vite.config.ts"),
  );

  const localDependencies = collectLocalDependencies(packedPackages, fixtureManifest);
  const dependencies = {};
  for (const [dependency, { manifest, packageRoot }] of localDependencies) {
    dependencies[dependency] = manifest.version;
    const installedRoot = join(consumerRoot, "node_modules", ...dependency.split("/"));
    mkdirSync(dirname(installedRoot), { recursive: true });
    symlinkSync(
      packageRoot,
      installedRoot,
      process.platform === "win32" ? "junction" : "dir",
    );
  }
  validatePackedPeers(packedPackages, localDependencies);

  writeFileSync(
    join(consumerRoot, "package.json"),
    `${JSON.stringify(
      {
        name: "@praabindh/aura-packed-consumer-check",
        version: "1.0.0",
        private: true,
        type: "module",
        dependencies,
      },
      null,
      2,
    )}\n`,
  );

  const baseTsconfig = readJson(join(repositoryRoot, "tsconfig.base.json"));
  const fixtureTsconfig = readJson(join(fixtureRoot, "tsconfig.json"));
  const compilerOptions = {
    ...baseTsconfig.compilerOptions,
    ...fixtureTsconfig.compilerOptions,
  };
  delete compilerOptions.baseUrl;
  delete compilerOptions.paths;
  writeFileSync(
    join(consumerRoot, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions,
        include: ["src", "vite.config.ts"],
      },
      null,
      2,
    )}\n`,
  );

  execFileSync(
    npmCli,
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      // npm cannot infer versions from the pre-seeded directory links. Required
      // PADS peer closure and ranges are validated explicitly above.
      "--legacy-peer-deps",
      "--no-save",
      ...packedPackages.map(({ tarball }) => tarball),
    ],
    { cwd: consumerRoot, env: environment, stdio: "inherit" },
  );

  for (const [name, { manifest }] of localDependencies) {
    const installedManifest = readJson(
      join(consumerRoot, "node_modules", ...name.split("/"), "package.json"),
    );
    if (installedManifest.version !== manifest.version) {
      throw new Error(
        `${name} installed with unexpected version ${installedManifest.version}.`,
      );
    }
  }

  for (const { manifest } of packedPackages) {
    const installedRoot = join(
      consumerRoot,
      "node_modules",
      ...manifest.name.split("/"),
    );
    if (lstatSync(installedRoot).isSymbolicLink()) {
      throw new Error(
        `${manifest.name} was linked instead of installed from its tarball.`,
      );
    }
    const installedManifest = readJson(join(installedRoot, "package.json"));
    if (
      installedManifest.name !== manifest.name ||
      installedManifest.version !== manifest.version
    ) {
      throw new Error(
        `${manifest.name} installed with unexpected identity ${installedManifest.name}@${installedManifest.version}.`,
      );
    }
  }

  execFileSync(executable(consumerRoot, "tsc"), ["-p", "tsconfig.json", "--noEmit"], {
    cwd: consumerRoot,
    env: environment,
    stdio: "inherit",
  });
  execFileSync(executable(consumerRoot, "vite"), ["build"], {
    cwd: consumerRoot,
    env: environment,
    stdio: "inherit",
  });
}

try {
  mkdirSync(tarballRoot, { recursive: true });
  const packedPackages = [];
  for (const { name, profile } of packages) {
    const cwd = join(repositoryRoot, "packages", name);
    const manifest = readJson(join(cwd, "package.json"));
    validateOptionalPackageBoundary(name, cwd, manifest);
    if (readFileSync(join(cwd, "LICENSE"), "utf8") !== canonicalLicense) {
      throw new Error(`${name} license has drifted from the repository license.`);
    }
    execFileSync(executable(repositoryRoot, "publint"), ["--strict"], {
      cwd,
      env: environment,
      stdio: "inherit",
    });
    execFileSync(
      executable(repositoryRoot, "attw"),
      ["--pack", ".", "--profile", profile, "--entrypoints", "."],
      { cwd, env: environment, stdio: "inherit" },
    );
    const packed = JSON.parse(
      execFileSync(npmCli, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
        cwd,
        encoding: "utf8",
        env: environment,
      }),
    );
    const files = packed[0]?.files?.map((file) => file.path) ?? [];
    if (
      !files.includes("package.json") ||
      !files.includes("README.md") ||
      !files.includes("LICENSE")
    ) {
      throw new Error(`${name} pack is missing package metadata, README, or license.`);
    }
    const leaked = files.filter((file) =>
      /(^|\/)(src|test|tests|coverage)(\/|$)|\.stories\.|\.test\.|\.env/i.test(file),
    );
    if (leaked.length > 0) {
      throw new Error(`${name} pack leaks non-release files: ${leaked.join(", ")}`);
    }

    const createdPack = JSON.parse(
      execFileSync(
        npmCli,
        ["pack", "--json", "--ignore-scripts", "--pack-destination", tarballRoot],
        { cwd, encoding: "utf8", env: environment },
      ),
    );
    const filename = createdPack[0]?.filename;
    if (!filename) {
      throw new Error(`${name} did not produce a package tarball.`);
    }
    const tarball = join(tarballRoot, filename);
    if (!existsSync(tarball)) {
      throw new Error(`${name} reported a missing package tarball: ${filename}.`);
    }
    packedPackages.push({ manifest, tarball });
  }

  createPackedConsumer(packedPackages);
  console.log(
    "Publint, Are the Types Wrong, package contents, and the isolated packed consumer are valid.",
  );
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
