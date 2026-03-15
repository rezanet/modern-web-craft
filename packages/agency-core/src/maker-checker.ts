import { generateObject, LanguageModel } from "ai";
import { z } from "zod";

export interface MakerCheckerParams<T> {
  model: LanguageModel;           // e.g., openai("gpt-4o")
  schema: z.ZodType<T>;           // The Zod schema we want the Maker to build (e.g., FunctionalScopeSchema)
  makerSystem: string;            // The Maker's skill.md contents
  checkerSystem: string;          // The Checker's skill.md contents
  taskPrompt: string;             // The client's raw request
  maxIterations?: number;         // Safety fallback to prevent infinite loops (default: 3)
}

export async function runMakerCheckerLoop<T>({
  model,
  schema,
  makerSystem,
  checkerSystem,
  taskPrompt,
  maxIterations = 3,
}: MakerCheckerParams<T>): Promise<T> {
  let iteration = 1;
  let currentDraft: T | null = null;
  let feedback = "";

  // The strict mathematical schema for the Checker's response
  const CheckerSchema = z.object({
    approved: z.boolean().describe("True ONLY if the draft perfectly meets all guidelines and the client request. False if it needs ANY changes."),
    critiques: z.array(z.string()).describe("Specific, actionable instructions for the Maker to fix in the next iteration. Empty if approved."),
  });

  while (iteration <= maxIterations) {
    console.log(`\n🔄 [Iteration ${iteration}/${maxIterations}] Maker is drafting...`);
    
    // 1. The Maker generates the draft
    const makerPrompt = feedback 
      ? `CLIENT TASK:\n${taskPrompt}\n\n⚠️ PREVIOUS DRAFT REJECTED. FEEDBACK FROM REVIEWER:\n${feedback}\n\nPlease revise your output to strictly address the reviewer's critiques.`
      : `CLIENT TASK:\n${taskPrompt}`;

    const { object: draft } = await generateObject({
      model,
      schema,
      system: makerSystem,
      prompt: makerPrompt,
    });

    currentDraft = draft;
    console.log(`✅ Maker finished draft. Handing off to Checker...`);

    // 2. The Checker reviews the Maker's draft
    const checkerPrompt = `ORIGINAL CLIENT TASK:\n${taskPrompt}\n\nMAKER'S DRAFT TO REVIEW:\n${JSON.stringify(draft, null, 2)}\n\nCritique this draft strictly against your guidelines.`;

    const { object: review } = await generateObject({
      model,
      schema: CheckerSchema,
      system: checkerSystem,
      prompt: checkerPrompt,
    });

    // 3. Evaluate the Checker's decision
    if (review.approved) {
      console.log(`🎉 Checker APPROVED the draft!`);
      return currentDraft;
    } else {
      console.log(`❌ Checker REJECTED the draft. Critiques:`);
      review.critiques.forEach(c => console.log(`  - ${c}`));
      
      // Store the feedback and loop again
      feedback = review.critiques.join("\n");
      iteration++;
    }
  }

  console.warn(`⚠️ Max iterations reached (${maxIterations}). Forcing approval of the latest draft to prevent infinite loops.`);
  return currentDraft!;
}
