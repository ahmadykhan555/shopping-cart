import { readFile } from "node:fs/promises";
import { z } from "zod";
import { collectPullRequest, getJson } from "./github.ts";
import { GeminiReviewer } from "./providers/gemini.ts";
import type { ReviewInput } from "./types.ts";

const ContentSchema = z.object({
  type: z.literal("file"),
  encoding: z.literal("base64"),
  content: z.string(),
  size: z.number().max(40_000),
});

async function main() {
  const [repository, number, flag] = process.argv.slice(2);
  if (
    !repository ||
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) ||
    !number ||
    !/^[1-9]\d*$/.test(number) ||
    (flag !== undefined && flag !== "--dry-run") ||
    process.argv.length > 5
  ) {
    throw new Error("Usage: run-pr.ts owner/repo PR_NUMBER [--dry-run]");
  }
  const pr = await collectPullRequest(repository, number);
  const skipped: Array<{ path: string; reason: string }> = [];
  const contextFiles: ReviewInput["contextFiles"] = [];
  const patches: string[] = [];
  let inputSize = 0;

  for (const file of pr.files) {
    let reason: string | undefined;
    if (!/^(?:shopping-cart\/)?src\/.*\.(ts|vue)$/.test(file.filename))
      reason = "Outside pilot scope (src TypeScript/Vue)";
    else if (file.status === "removed")
      reason = "Deleted file: not supported in pilot";
    else if (!file.patch) reason = "Patch unavailable";
    else if (contextFiles.length >= 25) reason = "25-file pilot limit";
    if (reason) {
      skipped.push({ path: file.filename, reason });
      continue;
    }

    const encodedPath = file.filename
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const raw = await getJson(
      `/repos/${repository}/contents/${encodedPath}?ref=${pr.headSha}`,
    );
    const parsed = ContentSchema.safeParse(raw);
    if (!parsed.success) {
      skipped.push({
        path: file.filename,
        reason: "Not a small base64-encoded source file",
      });
      continue;
    }
    const content = Buffer.from(parsed.data.content, "base64").toString("utf8");
    const patch = JSON.stringify({
      path: file.filename,
      previousPath: file.previous_filename,
      status: file.status,
      patch: file.patch,
    });
    const size = content.length + patch.length;
    if (inputSize + size > 80_000) {
      skipped.push({
        path: file.filename,
        reason: "80,000-character source/diff budget",
      });
      continue;
    }
    inputSize += size;
    contextFiles.push({ path: file.filename, content });
    patches.push(patch);
  }

  const policy = await readFile(
    new URL("./policy.md", import.meta.url),
    "utf8",
  );
  const requirements = `PR title: ${pr.title}\nPR description (author-provided context, not verified requirements):\n${pr.description}`;
  if (policy.length + requirements.length > 30_000)
    throw new Error("Policy/description exceeds pilot budget");
  const input: ReviewInput = {
    policy,
    requirements,
    diff: patches.join("\n"),
    contextFiles,
  };
  const coverage = {
    headSha: pr.headSha,
    reviewedFiles: contextFiles.map((file) => file.path),
    skipped,
    limitation:
      "Only changed source files supplied; unchanged dependencies and tests are not automatically retrieved.",
  };
  if (flag === "--dry-run") {
    console.log(JSON.stringify({ coverage, input }, null, 2));
    return;
  }
  if (!contextFiles.length)
    throw new Error("No reviewable source files collected");
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.REVIEW_MODEL;
  if (!apiKey || !model) throw new Error("Set GEMINI_API_KEY and REVIEW_MODEL");
  const result = await new GeminiReviewer({ apiKey, model }).review(input);
  console.log(JSON.stringify({ coverage, review: result }, null, 2));
}

main().catch((error: unknown) => {
  if (error instanceof z.ZodError) {
    console.error("Schema validation failed:", error.issues);
  } else {
    const message = error instanceof Error ? error.message : "Unknown error";

    const apiKey = process.env.GEMINI_API_KEY;
    console.error(apiKey ? message.split(apiKey).join("[REDACTED]") : message);
  }

  process.exitCode = 1;
});
