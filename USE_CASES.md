# Use Cases & User Stories

This document defines the operational workflow of the AI Agency. It dictates how the human client interacts with the system and how the agents collaborate to produce artifacts.

## Epic 1: Strategy & Discovery (The Orchestrator)
**Goal:** Extract undeniable business logic from the client to eliminate LLM guesswork.

* **UC 1.1: The Briefing:** As a client, I want to describe my business in plain text so the Orchestrator can formulate a structured strategy.
* **UC 1.2: The Pushback:** As the Orchestrator, if the client's prompt is too vague (e.g., "Build a shoe store"), I must push back and ask for target demographics, price point, and brand vibe.
* **UC 1.3: Strategy Lock:** As the Orchestrator, I must output a strict `StrategyBrief` JSON object that locks in the tone of voice, forbidden words, and brand archetype.

## Epic 2: Design Architecture (The Architect)
**Goal:** Create a mathematically sound, accessible design system based on the Strategy.

* **UC 2.1: Color Mathematics:** As the Architect, I will ingest the Strategy and output a semantic color palette (Primary, Secondary, Muted, Destructive). I must ensure WCAG AA contrast for all text/background pairings.
* **UC 2.2: Typography Rhythm:** As the Architect, I will select Google Fonts that match the brand archetype and lock them into a strict modular scale (`rem` based) to prevent layout shifting.
* **UC 2.3: Omnichannel Tokens:** As the Architect, the `BrandBlueprint.json` I create must be platform-agnostic, meaning it can be consumed by the web app, a PDF generator, or a social media image generator.

## Epic 3: Artifact Generation (The Builder)
**Goal:** Generate polished artifacts that strictly inherit the Architect's rules.

* **UC 3.1: UI Generation:** As the Builder, I will generate React interfaces using *only* the internal component library, ensuring pixel-perfect alignment with the Architect's CSS tokens.
* **UC 3.2: Copywriting (Future):** As the Copywriter Agent, I will ingest the `StrategyBrief` and write marketing copy that strictly avoids the "forbidden words" and matches the defined tone of voice.
