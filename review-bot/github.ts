import { z } from "zod";

const PullRequestSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  changed_files: z.number(),
  head: z.object({ sha: z.string() }),
  base: z.object({ sha: z.string() }),
});

const ChangedFilesSchema = z.array(
  z.object({
    filename: z.string(),
    previous_filename: z.string().optional(),
    status: z.string(),
    patch: z.string().optional(),
  }),
);

export async function getJson(path: string): Promise<unknown> {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      JSON.stringify({
        status: response.status,
        message: body?.message,
        remaining: response.headers.get("x-ratelimit-remaining"),
        reset: response.headers.get("x-ratelimit-reset"),
        retryAfter: response.headers.get("retry-after"),
      }),
    );
  }
  return response.json();
}

export async function collectPullRequest(repository: string, number: string) {
  const path = `/repos/${repository}/pulls/${number}`;
  const pr = PullRequestSchema.parse(await getJson(path));
  if (pr.changed_files > 3000) {
    throw new Error("PR exceeds the GitHub files endpoint limit");
  }

  const files: z.infer<typeof ChangedFilesSchema> = [];
  for (let page = 1; ; page++) {
    const batch = ChangedFilesSchema.parse(
      await getJson(`${path}/files?per_page=100&page=${page}`),
    );
    files.push(...batch);
    if (batch.length < 100) break;
  }

  // The files endpoint is live: detect changes during paginated collection.
  const current = PullRequestSchema.parse(await getJson(path));
  if (
    current.head.sha !== pr.head.sha ||
    current.base.sha !== pr.base.sha ||
    current.changed_files !== pr.changed_files ||
    files.length !== pr.changed_files
  ) {
    throw new Error("PR changed during collection; rerun inspection");
  }

  return {
    repository,
    number: pr.number,
    title: pr.title,
    description: pr.body ?? "",
    headSha: pr.head.sha,
    baseSha: pr.base.sha,
    files,
    filesWithoutPatch: files
      .filter((file) => !file.patch)
      .map((file) => file.filename),
  };
}
