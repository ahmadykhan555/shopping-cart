/**
 * Git root is one directory above this package (see README). Husky’s default
 * installer expects .git in cwd, so we point the parent repo at shopping-cart/.husky.
 */
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const gitRoot = join(appRoot, "..");
/** Relative to git root (parent of appRoot). */
const hooksDir = "shopping-cart/.husky";
const prePushHook = join(appRoot, ".husky", "pre-push");

if (!existsSync(join(gitRoot, ".git"))) {
  console.warn("husky: skipping hook setup (.git not found)");
  process.exit(0);
}

execFileSync("git", ["config", "core.hooksPath", hooksDir], {
  cwd: gitRoot,
  stdio: "inherit",
});

chmodSync(prePushHook, 0o755);
