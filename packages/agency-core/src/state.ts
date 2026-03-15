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
// 3. MARKETING DEPARTMENT (Marketing Director)
// ---------------------------------------------------------
export const MarketingPlanSchema = z.object({
  seoKeywords: z.array(z.string()).describe("Primary keywords to target for organic growth."),
  contentPillars: z.array(z.string()).describe("The core topics the brand will talk about online."),
  primaryChannels: z.array(z.string()).describe("The best social media platforms for this specific audience."),
});

// ---------------------------------------------------------
// 4. THE GLOBAL "WAR ROOM" STATE
// ---------------------------------------------------------
// This represents the entire state of the agency at any given moment.
export const ProjectStateSchema = z.object({
  // The current phase of the agency pipeline
  status: z.enum([
    "idle", 
    "scoping", 
    "branding", 
    "designing", 
    "marketing", 
    "production", 
    "completed"
  ]).default("idle"),
  
  // Department Outputs (Nullable because they start empty!)
  scope: FunctionalScopeSchema.nullable().default(null),
  tech: TechnicalSpecSchema.nullable().default(null),
  brand: BrandIdentitySchema.nullable().default(null),
  design: DesignSystemSchema.nullable().default(null),
  marketing: MarketingPlanSchema.nullable().default(null),
});

// Export the TypeScript types for our UI and Agents to use
export type ProjectState = z.infer<typeof ProjectStateSchema>;
export type FunctionalScope = z.infer<typeof FunctionalScopeSchema>;
export type BrandIdentity = z.infer<typeof BrandIdentitySchema>;
