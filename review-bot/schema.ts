import { z } from "zod";

export const FindingSchema = z.object({
  path: z.string(), // Identifies the repository-relative file
  lines: z.number().int().min(1), // Identifies a source line; must be a positive integer
  severity: z.enum(["error", "warning", "info"]), // Restricts the model to our agreed severity levels
  title: z.string().min(1), //Gives reviewers a short, actionable description
  explanation: z.string().min(1), // Contains the trigger, consequence, and evidence
  suggestion: z.string().nullable(), // Offers a correction; null when none is useful
});

export const ReviewResultSchema = z.object({
  findings: z.array(FindingSchema),
});

export type Finding = z.infer<typeof FindingSchema>;
export type ReviewResult = z.infer<typeof ReviewResultSchema>;
