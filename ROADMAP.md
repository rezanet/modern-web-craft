# Development Roadmap

This roadmap outlines the phases required to upgrade the monorepo from a standard Gen-UI sandbox into a fully autonomous, deterministic AI Agency.

## Phase 1: The Orchestrator (Strategy & Discovery)
* [ ] Define the `StrategyBrief` Zod Schema (Tone, Audience, Archetypes).
* [ ] Build the multi-step UI in Next.js (Chat UI tailored for interviewing).
* [ ] Implement the Orchestrator Agent prompt logic to enforce pushback on vague client inputs.

## Phase 2: The Architect (Design Systems)
* [ ] Expand the `BrandBlueprint` Zod Schema to ingest the `StrategyBrief`.
* [ ] Upgrade the `compile.ts` script to handle complex font imports and extended color palettes.
* [ ] Build a "Brand Dashboard" UI that visually displays the Architect's generated design system to the client for approval.

## Phase 3: The Builder (UI & Component Expansion)
* [ ] Expand `@craft/ui-system` to include complex layout primitives (Grids, Heros, Footers, Navbars).
* [ ] Update the AST parser (`build-context.ts`) to automatically categorize and document these new components for the LLM.
* [ ] Wire the Builder Agent to ingest the approved Brand Blueprint and generate full-page layouts.

## Phase 4: Omnichannel Expansion (Beyond the Web)
* [ ] Introduce `@craft/pdf-engine`: Allow the Builder to generate highly-styled PDF strategy documents based on the Blueprint.
* [ ] Introduce `@craft/social-engine`: Integrate Vercel Satori to generate dynamic Open Graph / Social Media images using the exact same design tokens.
