# Agency Operations: Use Cases & User Stories

This document defines how the human client interacts with the Agency and how the AI agents interact with each other.

## Epic 1: Scoping & Requirements (Product Department)
**Goal:** Define exactly what is being built before any creative work begins.
* **UC 1.1 (The Client Interview):** As a Business Analyst Agent, I will ask the client targeted questions to extract the core problem, user personas, and required features.
* **UC 1.2 (Scope Generation):** As the BA Agent, I will generate a strict Functional Requirements Document (FRD).
* **UC 1.3 (Technical Architecture):** As the CTO Agent, I will read the FRD and generate a data schema and technical constraints document (e.g., "Requires a PostgreSQL database and Stripe integration").

## Epic 2: Brand & Design (Creative Department)
**Goal:** Establish a unique, non-generic aesthetic.
* **UC 2.1 (Brand Identity):** As the Brand Strategist, I will define the Tone of Voice, Brand Archetype, and emotional goals based on the BA's target audience.
* **UC 2.2 (Design Tokens):** As the Brand Architect, I will generate a WCAG-compliant color palette and modular typography scale.
* **UC 2.3 (Creative Director Review):** As the Creative Director Agent, I will review the Architect's colors against the Brand Identity. (e.g., If the brand is "Playful/Kids" but the Architect chose "Corporate Navy", I will reject it and force a revision).

## Epic 3: Content & Marketing (Marketing Department)
**Goal:** Generate compelling, SEO-driven text.
* **UC 3.1 (Marketing Strategy):** As the Marketing Director, I will define the core content pillars and SEO keywords.
* **UC 3.2 (Copywriting):** As the Copywriter Agent, I will write the website copy, adhering strictly to the Strategist's Tone of Voice and the Marketing Director's SEO keywords.

## Epic 4: Production & QA (Engineering Department)
**Goal:** Generate polished, accessible React code.
* **UC 4.1 (UI Generation):** As the Builder Agent, I will write React components that fulfill the BA's functional requirements, utilize the Architect's design tokens, and populate with the Copywriter's text.
* **UC 4.2 (Accessibility Audit):** As the QA Agent, I will parse the Builder's code to ensure it contains proper ARIA labels, semantic HTML, and responsive Tailwind classes, rejecting the code if it fails.
