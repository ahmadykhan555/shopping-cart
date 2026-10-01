/**
 * Point this repo’s git hooks at .husky (same directory as package.json).
 */
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const hooksDir = ".husky";
const prePushHook = join(appRoot, ".husky", "pre-push");

if (!existsSync(join(appRoot, ".git"))) {
  console.warn("husky: skipping hook setup (.git not found)");
  process.exit(0);
}

execFileSync("git", ["config", "core.hooksPath", hooksDir], {
  cwd: appRoot,
  stdio: "inherit",
});

chmodSync(prePushHook, 0o755);
