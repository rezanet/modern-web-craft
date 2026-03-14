import { z } from "zod";

// The AI MUST fill this out completely before generating UI.
export const BrandBlueprintSchema = z.object({
  discovery: z.object({
    targetAudience: z.string(),
    coreProblemSolved: z.string(),
    brandPersonality: z.array(z.enum(["Playful", "Corporate", "Minimalist", "Bold", "Elegant"])),
    designPrinciples: z.array(z.string().describe("3 core rules the UI must follow (e.g., 'Content over Chrome')")),
  }),
  branding: z.object({
    logoConcept: z.string().describe("A prompt that could be fed to Midjourney/DALL-E to generate the logo"),
    typography: z.object({
      headingFont: z.string(),
      bodyFont: z.string(),
    }),
    colorPalette: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex code"),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    }),
  }),
});

export type BrandBlueprint = z.infer<typeof BrandBlueprintSchema>;
