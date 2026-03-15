# Architecture: The Agentic Pipeline

This system rejects the standard "chatbot" paradigm. It is an asynchronous, state-driven pipeline where specialized agents collaborate, critique, and build upon a shared source of truth.

## 🧠 The Shared Agency State (Memory)
Instead of passing chat histories, the agency relies on a central, strictly-typed JSON state object: `ProjectState`.
As agents complete their tasks, they update their specific node in the state:
* `ProjectState.businessScope` (Owned by BA Agent)
* `ProjectState.technicalSpecs` (Owned by CTO Agent)
* `ProjectState.brandIdentity` (Owned by Strategy Agent)
* `ProjectState.designSystem` (Owned by Architect Agent)
* `ProjectState.marketingPlan` (Owned by Marketing Agent)

## 🔄 The Maker/Checker Loop (Actor-Critic)
To ensure deterministic high quality, critical tasks utilize a peer-review loop:
1. **Generate:** The Maker Agent drafts the JSON artifact based on the `ProjectState`.
2. **Critique:** The Reviewer Agent reads the draft, compares it to the foundational rules (Zod schemas and prior state), and outputs a boolean `approved` and an array of `critiques`.
3. **Revise:** If `approved: false`, the Maker Agent runs again, specifically addressing the `critiques`.
4. **Commit:** Once `approved: true`, the artifact is committed to the `ProjectState` and the next department is unblocked.

## 🏗 Directory Flow
1. `apps/showcase-web/` -> The "Client Portal" (Dashboard for humans to view agent progress).
2. `packages/agency-core/` -> (NEW) The orchestration engine, holding the `ProjectState` and Maker/Checker workflow logic.
3. `packages/design-architect/` -> Houses the Zod schemas for the Creative and Strategy departments.
4. `packages/theme-core/` -> Compiles the Architect's JSON into CSS.
5. `packages/ui-system/` -> The headless React components.
6. `packages/gen-ui/` -> The Engineering department (Builder & QA Agents).
