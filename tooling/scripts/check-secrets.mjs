import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repositoryRoot = process.cwd();
const scannerPath = path.join("tooling", "scripts", "check-secrets.mjs");
const ignoredDirectories = new Set([
  ".git",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "storybook-static",
  "test-results",
]);
const ignoredFiles = new Set([scannerPath, ".env.example"]);

const credentialPatterns = [
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: "GitHub access token",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  },
  {
    name: "AWS access key",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  },
  {
    name: "Google API key",
    pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/,
  },
  {
    name: "OpenAI API key",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  },
  {
    name: "npm access token",
    pattern: /\bnpm_[A-Za-z0-9]{20,}\b/,
  },
  {
    name: "Slack access token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  },
];

const findings = [];
let scannedFiles = 0;

async function scanDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(repositoryRoot, absolutePath);

    if (entry.isDirectory()) {
      await scanDirectory(absolutePath);
      continue;
    }

    if (!entry.isFile() || ignoredFiles.has(relativePath)) continue;

    const source = await readFile(absolutePath);
    if (source.includes(0)) continue;

    scannedFiles += 1;
    const text = source.toString("utf8");
    for (const credential of credentialPatterns) {
      if (credential.pattern.test(text)) {
        findings.push(`${relativePath}: possible ${credential.name}`);
      }
    }
  }
}

await scanDirectory(repositoryRoot);

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Secret scan passed across ${scannedFiles} repository files.`);
}
