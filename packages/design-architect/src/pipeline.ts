import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { BrandBlueprintSchema } from "./schemas/blueprint.schema";
import fs from "fs";
import path from "path";

export async function runArchitectPipeline(userRequirements: string) {
  console.log("🧠 Agent 1: Analyzing requirements...");
  
  // 1. Force the AI to act as an agency team and build the blueprint
  const { object: blueprint } = await generateObject({
    model: openai("gpt-4o"),
    schema: BrandBlueprintSchema,
    system: `You are an elite UX Researcher and Frontend Architect. 
    The user will give you a raw idea. 
    You must define the 'Why' (Design Principles) and the 'What' (Brand & Colors) before the 'How'.
    Output a strictly formatted design system blueprint.`,
    prompt: userRequirements,
  });

  console.log("🎨 Agent 2: Blueprint Generated! Compiling Design Tokens...");

  // 2. Write the JSON blueprint to the disk so the rest of the monorepo can use it
  const themePath = path.resolve(process.cwd(), "packages/theme-core/src/theme.json");
  fs.writeFileSync(themePath, JSON.stringify(blueprint, null, 2));

  // 3. (Optional Magic) Automatically inject the colors into globals.css
  compileCSSVariables(blueprint.branding.colorPalette);

  return blueprint;
}

function compileCSSVariables(palette: Record<string, string>) {
  // This function takes the AI's hex codes and writes them directly into your CSS files,
  // instantly updating the entire monorepo's look and feel!
  const css = `
    :root {
      --primary: ${hexToHsl(palette.primary)};
      --background: ${hexToHsl(palette.background)};
      /* ... */
    }
  `;
  // Write to apps/showcase-web/app/globals.css
}
