import { z } from "zod";

// Helper: Enforces strict 6-digit Hex codes
const HexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid 6-digit hex code (e.g., #1A2B3C)");

// Helper: The core token structure forcing accessible pairings
const ColorToken = z.object({
  base: HexColor.describe("The main color used for backgrounds or large UI elements."),
  foreground: HexColor.describe("The text color placed ON TOP of the base color. MUST meet WCAG AA 4.5:1 contrast ratio."),
});

export const BrandBlueprintSchema = z.object({
  
  // 1. THE WHY: Strategy & Empathy
  strategy: z.object({
    brandName: z.string(),
    targetAudience: z.string(),
    coreVibe: z.enum(["Minimalist", "Playful", "Corporate", "Brutalism", "Elegant"]),
    designPrinciples: z.array(z.string()).length(3).describe("Exactly 3 non-negotiable UX/UI rules for this brand."),
  }),

  // 2. THE WHAT: Typography Scale (Major Third 1.250)
  typography: z.object({
    fonts: z.object({
      heading: z.string().describe("Google Font name for headings (e.g., 'Inter', 'Playfair Display')"),
      body: z.string().describe("Google Font name for body text"),
    }),
    scale: z.object({
      baseSize: z.literal("16px").describe("The root browser default"),
      h1: z.literal("3.052rem"), // 48.8px
      h2: z.literal("2.441rem"), // 39.0px
      h3: z.literal("1.953rem"), // 31.2px
      h4: z.literal("1.563rem"), // 25.0px
      h5: z.literal("1.250rem"), // 20.0px
      p: z.literal("1rem"),      // 16.0px
      small: z.literal("0.8rem"),// 12.8px
    }).describe("Strict Major Third modular scale. DO NOT deviate from these values."),
  }),

  // 3. THE WHAT: Spacing Grid (4pt system)
  spacing: z.object({
    system: z.literal("4pt-grid").describe("All padding/margins must be multiples of 0.25rem (4px)."),
    containerMaxWidth: z.string().describe("e.g., '1280px' or '1440px'"),
  }),

  // 4. THE WHAT: Semantic Color Architecture
  colors: z.object({
    // Structural Colors
    background: ColorToken.describe("The main page background and its default text color."),
    surface: ColorToken.describe("Cards, modals, and slightly elevated containers."),
    
    // Brand Colors
    primary: ColorToken.describe("The main brand action color (e.g., primary buttons, active states)."),
    secondary: ColorToken.describe("Less prominent actions or decorative elements."),
    muted: ColorToken.describe("Disabled states, borders, and secondary text."),
    
    // Feedback Colors
    success: ColorToken.describe("Used for success toasts, confirmations."),
    destructive: ColorToken.describe("Used for errors, delete buttons, warnings."),
  }),

  // 5. THE WHAT: Shape & Texture
  radii: z.object({
    button: z.enum(["0px", "4px", "8px", "9999px"]).describe("Border radius for interactive elements"),
    card: z.enum(["0px", "8px", "12px", "16px", "24px"]).describe("Border radius for large structural elements"),
  }),
});

export type BrandBlueprint = z.infer<typeof BrandBlueprintSchema>;
