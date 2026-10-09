import type { ReviewResult } from "./schema";

export interface ReviewInput {
  policy: string; // Trusted rules for reviewing this repository
  requirements: string; // Expected behavior of the feature
  diff: string; // The Git diff of the changes being reviewed
  contextFiles: Array<{ path: string; content: string }>; // Surrounding source and tests needed to understand the change
}

export interface ReviewModel {
  review(input: ReviewInput): Promise<ReviewResult>;
}
