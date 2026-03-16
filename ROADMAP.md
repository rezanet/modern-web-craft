# Development Roadmap

## Phase 1: Agency Core & The "War Room"
* [x] Initialize `@craft/agency-core` package.
* [x] Define the global `ProjectState` interface (the shared memory graph).
* [x] Build the underlying "Maker/Checker" utility function to handle AI peer reviews.
* [x] Create the Next.js "Client Portal" to visualize the `ProjectState` as it builds.

## Phase 2: The Product Department (Scoping)
* [x] Build the Business Analyst Agent and its Zod schemas (Functional Requirements).
* [x] Build the CTO Agent and its Zod schemas (Technical Requirements & Data Models).

## Phase 3: The Creative Department (Brand & Design)
* [x] Build the Brand Strategist Agent (Tone, Archetype).
* [x] Implement the Creative Director Agent to govern the Maker/Checker loop for design.
* [x] Upgrade the Brand Architect Agent (Colors, Typography).

## Phase 4: The Marketing Department (Content)
* [x] Build the Marketing Director Agent (SEO, Channels).
* [x] Build the Copywriter Agent (Web copy, Social captions).

## Phase 5: The Engineering Department (Production)
* [ ] Upgrade the Builder Agent to pull from the new `ProjectState`.
* [ ] Build the QA Auditor Agent to check React ASTs for accessibility and code quality.

## Phase 6: Output & Export
* [ ] Generate a beautiful, downloadable "Brand Book & Strategy PDF" from the completed `ProjectState`.
* [ ] Generate the final interactive UI components.
