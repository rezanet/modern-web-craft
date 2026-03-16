import { z } from "zod";

// ---------------------------------------------------------
// 1. PRODUCT DEPARTMENT (Business Analyst & CTO)
// ---------------------------------------------------------
export const FunctionalScopeSchema = z.object({
  coreProblem: z.string().describe("The primary problem this product solves for the user."),
  targetAudience: z.array(z.string()).describe("Specific demographic or psychographic personas."),
  keyFeatures: z.array(z.string()).describe("List of absolute must-have functional features."),
});

export const TechnicalSpecSchema = z.object({
  database: z.string().describe("The recommended database architecture."),
  authentication: z.string().describe("How users will log in (e.g., OAuth, Magic Links)."),
  externalAPIs: z.array(z.string()).describe("Third-party services required (e.g., Stripe, SendGrid)."),
});

// ---------------------------------------------------------
// 2. CREATIVE DEPARTMENT (Brand Strategist & Architect)
// ---------------------------------------------------------
export const BrandIdentitySchema = z.object({
  toneOfVoice: z.array(z.string()).describe("3-5 adjectives describing how the brand speaks."),
  archetype: z.string().describe("The Jungian brand archetype (e.g., The Magician, The Sage)."),
  forbiddenWords: z.array(z.string()).describe("Words the copywriter must NEVER use."),
});

export const DesignSystemSchema = z.object({
  colors: z.record(z.string(), z.string()).describe("The finalized hex codes for the UI."),
  typography: z.object({
    headingFont: z.string(),
    bodyFont: z.string(),
  }),
});

// ---------------------------------------------------------
// 3. MASSIVE MARKETING ENGINE (5 Parallel Agents)
// ---------------------------------------------------------
export const MarketStrategySchema = z.object({
  positioningStatement: z.string().describe("A 1-2 sentence core market positioning statement."),
  pricingModel: z.string().describe("The high-level pricing strategy (e.g., Freemium, Enterprise Sales, Tiered SaaS)."),
  growthLevers: z.array(z.string()).describe("Top 3 areas to leverage for rapid user acquisition."),
});

export const MarketCompetitiveSchema = z.object({
  directCompetitors: z.array(z.string()).describe("Top 3 direct market competitors."),
  competitiveAdvantage: z.string().describe("The unfair advantage or unique selling proposition (USP)."),
  marketGaps: z.array(z.string()).describe("Weaknesses in competitors that this product will exploit."),
});

export const MarketTechnicalSchema = z.object({
  seoArchitecture: z.string().describe("Core technical SEO strategy (e.g., Programmatic SEO, SSR content hubs)."),
  analyticsStack: z.array(z.string()).describe("Recommended tracking and analytics tools."),
  keyConversionEvents: z.array(z.string()).describe("The critical user actions to track in the funnel."),
});

export const MarketContentSchema = z.object({
  contentPillars: z.array(z.string()).describe("The 3-4 main topics the brand will consistently publish about."),
  primaryChannels: z.array(z.string()).describe("The absolute best distribution channels for this specific audience."),
  heroCopy: z.string().describe("A high-converting H1 headline for the landing page."),
});

export const MarketConversionSchema = z.object({
  funnelStages: z.array(z.string()).describe("The exact steps from awareness to conversion."),
  leadMagnet: z.string().describe("The proposed high-value free offer to capture emails."),
  croHypotheses: z.array(z.string()).describe("A/B testing ideas to improve initial conversion rates."),
});

// ---------------------------------------------------------
// 4. THE GLOBAL "WAR ROOM" STATE
// ---------------------------------------------------------
export const ProjectStateSchema = z.object({
  status: z.enum([
    "idle",
    "scoping",
    "branding",
    "designing",
    "marketing-engine", // Updated phase to represent the parallel execution
    "production",
    "completed"
  ]).default("idle"),

  // Existing Departments
  scope: FunctionalScopeSchema.nullable().default(null),
  tech: TechnicalSpecSchema.nullable().default(null),
  brand: BrandIdentitySchema.nullable().default(null),
  design: DesignSystemSchema.nullable().default(null),

  // The 5-Agent Marketing Engine Slices
  marketStrategy: MarketStrategySchema.nullable().default(null),
  marketCompetitive: MarketCompetitiveSchema.nullable().default(null),
  marketTechnical: MarketTechnicalSchema.nullable().default(null),
  marketContent: MarketContentSchema.nullable().default(null),
  marketConversion: MarketConversionSchema.nullable().default(null),
});

export type ProjectState = z.infer<typeof ProjectStateSchema>;
export type FunctionalScope = z.infer<typeof FunctionalScopeSchema>;
export type BrandIdentity = z.infer<typeof BrandIdentitySchema>;
export type MarketStrategy = z.infer<typeof MarketStrategySchema>;
export type MarketCompetitive = z.infer<typeof MarketCompetitiveSchema>;
export type MarketTechnical = z.infer<typeof MarketTechnicalSchema>;
export type MarketContent = z.infer<typeof MarketContentSchema>;
export type MarketConversion = z.infer<typeof MarketConversionSchema>;
