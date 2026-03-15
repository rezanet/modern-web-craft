import fs from "fs";
import path from "path";
import { openai } from "@ai-sdk/openai";
import { BrandBlueprintSchema } from "./schemas/blueprint.schema";
import { runMakerCheckerLoop } from "@craft/agency-core";

export async function runArchitectPipeline(userRequirements: string) {
  console.log("🧠 Architecture Pipeline: Generating and reviewing brand blueprint...");

  const makerSystem = [
    "You are an elite UX Researcher and Frontend Brand Architect inside a digital agency.",
    "You will receive a raw idea from the client.",
    "You must define the 'Why' (design principles) and the 'What' (brand identity + colours) before the 'How'.",
    "Output must be strictly valid JSON matching the provided schema.",
    "Do not invent requirements not present in the client request.",
  ].join("\n");

  const checkerSystem = [
    "You are the Creative Director (Checker).",
    "Your job is to be strict and adversarial.",
    "Approve ONLY if the draft is brand-distinct, internally consistent, and clearly derived from the client request.",
    "Reject if any part looks generic, contradictory, or unjustified.",
    "Your critiques must be specific, actionable, and testable.",
  ].join("\n");

  const result = await runMakerCheckerLoop({
    model: openai("gpt-4o"),
    schema: BrandBlueprintSchema,
    makerSystem,
    checkerSystem,
    taskPrompt: userRequirements,
    maxIterations: 3,
    // I recommend hard-gating brand tokens:
    throwOnMaxIterations: true,
  });

  console.log(`🎨 Blueprint ${result.approved ? "APPROVED" : "NOT APPROVED"} after ${result.iterations} iteration(s).`);

  const blueprint = result.output;

  // Write the JSON blueprint to disk as a derived artefact (temporary integration contract)
  const themePath = path.resolve(process.cwd(), "packages/theme-core/src/theme.json");
  fs.writeFileSync(themePath, JSON.stringify(blueprint, null, 2), "utf8");

  // Optional: inject CSS variables (guarded)
  if (blueprint?.branding?.colorPalette) {
    compileCSSVariables(blueprint.branding.colorPalette);
  }

  return blueprint;
}

function compileCSSVariables(palette: Record<string, string>) {
  // Minimal safe placeholder: only writes if keys exist.
  // You should decide the canonical mapping keys in your schema (primary/background/etc).
  const primary = palette.primary ?? palette.brandPrimary ?? palette.accent ?? "#000000";
  const background = palette.background ?? palette.surface ?? "#ffffff";

  const css = `
:root {
  --primary: ${hexToHsl(primary)};
  --background: ${hexToHsl(background)};
}
`.trimStart();

  const globalsPath = path.resolve(process.cwd(), "apps/showcase-web/app/globals.css");

  // naive replace block approach (upgrade later to a proper marker system)
  const markerStart = "/* @craft:tokens:start */";
  const markerEnd = "/* @craft:tokens:end */";

  let existing = "";
  if (fs.existsSync(globalsPath)) existing = fs.readFileSync(globalsPath, "utf8");

  const tokenBlock = `${markerStart}\n${css}\n${markerEnd}\n`;

  const updated = existing.includes(markerStart) && existing.includes(markerEnd)
    ? existing.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`, "m"), tokenBlock)
    : `${tokenBlock}\n${existing}`;

  fs.writeFileSync(globalsPath, updated, "utf8");
}

/**
 * Placeholder implementation.
 * Replace with a proper hex -> HSL conversion you trust.
 */
function hexToHsl(hex: string) {
  return hex; // TODO: implement real conversion
}
