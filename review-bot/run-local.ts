import { readFile } from "node:fs/promises";
import { GeminiReviewer } from "./providers/gemini.ts";
import type { ReviewInput, ReviewModel } from "./types.ts";

// Resolve paths relative to this file, independent of the shell's working directory.
const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8");

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--dry-run")) {
    throw new Error("Usage: run-local.ts [--dry-run]");
  }

  const [policy, requirements, diff, source, constants] = await Promise.all([
    read("./policy.md"),
    read("./fixtures/requirements.md"),
    read("./fixtures/change.diff"),
    read("./fixtures/cart.after.txt"),
    read("./fixtures/constants.txt"),
  ]);

  const input: ReviewInput = {
    policy,
    requirements,
    diff,
    contextFiles: [
      { path: "src/utils/cart.ts", content: source },
      { path: "src/consts/cart.ts", content: constants },
    ],
  };

  if (args.includes("--dry-run")) {
    console.log(JSON.stringify(input, null, 2));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-3.5-flash-lite";
  if (!apiKey || !model) {
    throw new Error("Set GEMINI_API_KEY and REVIEW_MODEL before a live review");
  }

  const reviewer: ReviewModel = new GeminiReviewer({ apiKey, model });
  const result = await reviewer.review(input);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(() => {
  // Avoid logging raw SDK errors that could include sensitive request details.
  console.error(
    "Review unavailable. Check fixture files, configuration, model access, and quota. No review result was produced.",
  );
  process.exitCode = 1;
});
