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
    throwOnMaxIterations: true,
  });

  console.log(`🎨 Blueprint ${result.approved ? "APPROVED" : "NOT APPROVED"} after ${result.iterations} iteration(s).`);

  const blueprint = result.output;

  // Write the JSON blueprint to disk as a derived artefact (temporary integration contract)
  const themePath = path.resolve(process.cwd(), "packages/theme-core/src/theme.json");
  fs.writeFileSync(themePath, JSON.stringify(blueprint, null, 2), "utf8");

  // Optional: inject CSS variables (guarded)
  if (blueprint?.colors) {
    compileCSSVariables(blueprint.colors as unknown as Record<string, {base: string, foreground: string}>);
  }

  return blueprint;
}

function compileCSSVariables(colors: Record<string, {base: string, foreground: string}>) {
  let css = `:root {\n`;
  
  for (const [semanticName, token] of Object.entries(colors)) {
    css += `  --${semanticName}: ${hexToRgb(token.base)};\n`;
    css += `  --${semanticName}-foreground: ${hexToRgb(token.foreground)};\n`;
  }
  css += `}\n`;

  const globalsPath = path.resolve(process.cwd(), "apps/showcase-web/app/globals.css");

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

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}
