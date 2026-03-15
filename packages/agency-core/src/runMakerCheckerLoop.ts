import { generateObject, LanguageModel } from "ai";
import { z } from "zod";

/**
 * A strict Maker/Checker loop that:
 * - Produces a typed artefact (Maker)
 * - Reviews against a strict rubric (Checker)
 * - Iterates until approved or maxIterations reached
 *
 * IMPORTANT: This function never "forces approval".
 * It either returns approved output, or returns a non-approved result (or throws, depending on options).
 */

export type CheckerReview = {
  approved: boolean;
  critiques: string[];
};

export type MakerCheckerIteration<T> = {
  iteration: number;
  makerPrompt: string;
  draft: T;
  checkerPrompt: string;
  review: CheckerReview;
};

export type MakerCheckerResult<T> = {
  approved: boolean;
  output: T;
  iterations: number;
  trace: MakerCheckerIteration<T>[];
  lastReview: CheckerReview;
};

export interface MakerCheckerParams<T> {
  /** e.g. openai("gpt-4o") */
  model: LanguageModel;

  /** The schema we want the Maker to build (e.g., FunctionalScopeSchema) */
  schema: z.ZodType<T>;

  /** Maker's system prompt contents (typically the skill.md contents) */
  makerSystem: string;

  /** Checker's system prompt contents (typically the skill.md contents) */
  checkerSystem: string;

  /** The client's raw request (or a structured task prompt) */
  taskPrompt: string;

  /** Safety fallback to prevent infinite loops (default: 3) */
  maxIterations?: number;

  /**
   * If true, throw an error when not approved after maxIterations.
   * If false (default), return approved=false with trace & lastReview.
   */
  throwOnMaxIterations?: boolean;

  /**
   * Optional event hook for UI/telemetry.
   * You can wire this into apps/showcase-web later.
   */
  onEvent?: (event: {
    type:
      | "maker:start"
      | "maker:done"
      | "checker:start"
      | "checker:done"
      | "iteration:rejected"
      | "iteration:approved"
      | "loop:exhausted";
    iteration: number;
    message: string;
    data?: unknown;
  }) => void;

  /**
   * Optional guard: clamp JSON sent to Checker to avoid huge drafts.
   * Default: 20_000 chars (enough for most structured artefacts).
   */
  maxDraftCharsForReview?: number;
}

const CheckerSchema = z.object({
  approved: z
    .boolean()
    .describe(
      "True ONLY if the draft perfectly meets all guidelines and the client request. False if it needs ANY changes."
    ),
  critiques: z
    .array(z.string())
    .describe(
      "Specific, actionable instructions for the Maker to fix in the next iteration. Empty if approved."
    ),
});

function formatCritiques(critiques: string[]): string {
  if (!critiques.length) return "";
  return critiques.map((c, i) => `${i + 1}. ${c}`).join("\n");
}

function clampString(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input;
  return `${input.slice(0, maxChars)}\n\n[...truncated ${input.length - maxChars} chars]`;
}

export async function runMakerCheckerLoop<T>({
  model,
  schema,
  makerSystem,
  checkerSystem,
  taskPrompt,
  maxIterations = 3,
  throwOnMaxIterations = false,
  onEvent,
  maxDraftCharsForReview = 20_000,
}: MakerCheckerParams<T>): Promise<MakerCheckerResult<T>> {
  const trace: MakerCheckerIteration<T>[] = [];
  let lastDraft: T | null = null;
  let lastReview: CheckerReview | null = null;
  let feedbackBlock = "";

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    onEvent?.({
      type: "maker:start",
      iteration,
      message: `Maker drafting (iteration ${iteration}/${maxIterations})`,
    });

    const makerPrompt = feedbackBlock
      ? [
          `CLIENT TASK:\n${taskPrompt}`,
          `\n⚠️ PREVIOUS DRAFT REJECTED. FEEDBACK FROM REVIEWER:\n${feedbackBlock}`,
          `\nRevise your output to address EVERY critique. Do not invent new requirements.`,
        ].join("\n")
      : `CLIENT TASK:\n${taskPrompt}`;

    let draft: T;
    try {
      const res = await generateObject({
        model,
        schema,
        system: makerSystem,
        prompt: makerPrompt,
      });
      draft = res.object;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error during Maker generation";
      throw new Error(`[MakerCheckerLoop] Maker failed on iteration ${iteration}: ${message}`);
    }

    lastDraft = draft;

    onEvent?.({
      type: "maker:done",
      iteration,
      message: "Maker finished draft",
      data: draft,
    });

    onEvent?.({
      type: "checker:start",
      iteration,
      message: "Checker reviewing draft",
    });

    const draftJson = clampString(JSON.stringify(draft, null, 2), maxDraftCharsForReview);

    const checkerRubric = [
      "REVIEW RUBRIC (be strict):",
      "- The draft must satisfy the ORIGINAL CLIENT TASK.",
      "- The draft must follow ALL rules in your system prompt (guidelines).",
      "- The draft must NOT invent requirements not present in the task or prior state.",
      "- If ANY item is missing, vague, contradictory, or non-actionable, set approved=false and explain exactly what to fix.",
      "- Critiques must be specific and testable.",
    ].join("\n");

    const checkerPrompt = [
      `ORIGINAL CLIENT TASK:\n${taskPrompt}`,
      `\nMAKER'S DRAFT TO REVIEW (JSON):\n${draftJson}`,
      `\n${checkerRubric}`,
      `\nReturn your verdict.`,
    ].join("\n");

    let review: CheckerReview;
    try {
      const res = await generateObject({
        model,
        schema: CheckerSchema,
        system: checkerSystem,
        prompt: checkerPrompt,
      });
      review = res.object;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error during Checker review";
      throw new Error(`[MakerCheckerLoop] Checker failed on iteration ${iteration}: ${message}`);
    }

    lastReview = review;

    onEvent?.({
      type: "checker:done",
      iteration,
      message: `Checker completed review (approved=${review.approved})`,
      data: review,
    });

    trace.push({
      iteration,
      makerPrompt,
      draft,
      checkerPrompt,
      review,
    });

    if (review.approved) {
      onEvent?.({
        type: "iteration:approved",
        iteration,
        message: "Checker approved the draft",
      });

      return {
        approved: true,
        output: draft,
        iterations: iteration,
        trace,
        lastReview: review,
      };
    }

    onEvent?.({
      type: "iteration:rejected",
      iteration,
      message: "Checker rejected the draft",
      data: review.critiques,
    });

    feedbackBlock = formatCritiques(review.critiques);
  }

  onEvent?.({
    type: "loop:exhausted",
    iteration: maxIterations,
    message: `Max iterations reached (${maxIterations}). Draft not approved.`,
    data: { lastReview },
  });

  if (!lastDraft || !lastReview) {
    throw new Error("[MakerCheckerLoop] Loop exhausted but no draft/review available (unexpected).");
  }

  if (throwOnMaxIterations) {
    throw new Error(
      `[MakerCheckerLoop] Not approved after ${maxIterations} iterations.\nLast critiques:\n${formatCritiques(
        lastReview.critiques
      )}`
    );
  }

  return {
    approved: false,
    output: lastDraft,
    iterations: maxIterations,
    trace,
    lastReview,
  };
}
