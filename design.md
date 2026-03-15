# design.md — Architectural Design Notes & Improvement Plan

## Purpose

This repository aims to behave like an **autonomous, self-correcting digital agency**: a state-driven, multi-agent pipeline that produces validated artefacts (requirements, brand system, content, UI) using **Zod-typed outputs** and a **Maker/Checker (Actor/Critic)** quality gate. 

This document lists the concrete design changes required to align implementation with the intended architecture and to keep the system maintainable as more departments/agents are added.


---

## Current State (what’s true today)

### Strengths
- Clear top-level intent and departmental model (Strategy/Product, Creative/Brand, Marketing, Engineering/QA). 
- Monorepo task graph is clean and conventional (Turbo tasks for build/dev/lint/typecheck/test). 
- “Skills” content is strong and already contains strict behavioural guardrails for some roles (notably BA and PO/Reviewer). 

### Misalignments (must fix)
- The implemented pipeline currently generates artefacts in a single pass and writes them to disk; this bypasses the documented “shared state + approval gate” design. 

- `Maker/Checker` currently **forces approval** when max iterations are reached. This breaks the “no artefact moves forward without approval” guarantee. 
- `packages/gen-ui/src/system-prompt.md` is empty, and there is no enforceable mechanism yet for context compilation and behaviour consistency.


---

## Architectural North Star (non-negotiables)

### 1) Single source of truth: `ProjectState`
- The canonical memory is a **strictly typed JSON state object** (`ProjectState`). Agents **read from and write to slices** of this state, not to ad-hoc files. 
- Disk outputs (e.g., `theme.json`, `globals.css` tokens) are **derived artefacts** from state and are rebuildable.

### 2) Quality gates: Maker/Checker
- Any “critical artefact” must pass a Maker/Checker loop before it can be committed into `ProjectState`. 

- **No forced approval**. If max iterations are reached, the system must either:
  - fail hard (throw) for hard gates, or
  - return a non-approved result that cannot be committed.

### 3) Skills are not agents; agents consume skills
- **Agents** define authority, decisions, and acceptance criteria.
- **Skills** are capability modules that may be selectively injected into an agent’s system prompt.
- Skills should never be used “raw” as the entire system prompt unless the file is explicitly an *Agent Profile*. 


---

## Recommendations (ordered, actionable)

## A. Fix Maker/Checker so it enforces the guarantee

### A1. Remove “forced approval” behaviour
Current behaviour: after `maxIterations`, the loop returns the latest draft regardless of rejection.
- **Change**: return a structured result `{ approved, output, lastReview, trace }` OR throw (configurable).
- **Rule**: artefacts that are not approved **must not be committed** into `ProjectState`.

Why: This preserves the documented contract: “No artefact moves to the next phase without approval.” 

### A2. Return full iteration trace for the “War Room”
- Store and return per-iteration:
  - maker prompt
  - draft
  - checker prompt
  - review output
- Expose an `onEvent` callback so the portal can visualise progress without scraping console logs.

Why: The roadmap explicitly calls for a portal that visualises progress; traces are the primary UX primitive for that. 
### A3. Anchor the Checker with a rubric
- Append a short “review rubric” into the checker prompt:
  - must satisfy original task
  - must comply with system rules
  - must not invent requirements
  - critiques must be testable

Why: Prevents review drift and makes failures deterministic. 


---

## B. Formalise `ProjectState` and slice ownership

### B1. Create `ProjectState` as a first-class TypeScript type
- Define the full interface in `packages/agency-core/src/state.ts`.
- Include a `version` and `updatedAt` at the root.

Minimum recommended shape (illustrative, not final):
- `businessScope` (BA)
- `technicalSpecs` (CTO)
- `brandIdentity` (Strategist)
- `designSystem` (Architect)
- `marketingPlan` (Marketing)
- `uiBlueprint` or `uiComponents` (Builder)
- `qaFindings` (QA)

Why: Your architecture document already describes this structure; the code must make it real. 

### B2. Enforce ownership rules
- Each agent owns a slice.
- Only the orchestrator can commit updates.
- Updates must be validated (Zod) before commit.

Why: Prevents “agent scribble” and preserves deterministic pipeline behaviour. 
### B3. Add append-only audit log
- Maintain `ProjectState.events[]` or a sidecar `audit.log.jsonl`.
- Record:
  - timestamp
  - agent
  - artefact type
  - approved boolean
  - critiques summary

Why: Needed for debugging, accountability, and dashboard UX. 

---

## C. Align pipelines to state-first orchestration (stop disk-first as contract)

### C1. Update `design-architect` pipeline to use Maker/Checker
- Replace single-pass `generateObject()` with Maker/Checker loop.
- On approval:
  - commit blueprint into `ProjectState.designSystem` (or a “blueprint” slice)
  - THEN (optionally) emit `theme.json` as a derived output for theme-core

Why: Matches the documented Maker/Checker gating and the “shared state memory” model. 

### C2. Treat `theme.json` as a build artefact
- `theme-core` should compile from state (preferred), or from a generated file that is clearly marked:
  - generated
  - rebuildable
  - not manually edited

Why: Keeps the repo converging towards the state-driven design instead of file-driven coupling. 


---

## D. Make “skills” structurally consistent and machine-consumable

### D1. Distinguish file types via front matter
Add front matter to every skill file:

- For Agent Profiles:
  - `type: agent`
  - `role: ...`
  - `department: ...`
  - `gate: maker|checker`
  - `outputs: ...`

- For Capability Skills:
  - `type: skill`
  - `capability: ...`
  - `appliesTo: [agents...]`
  - `packages: [...]` (optional)

Why: You already have strong content, but it needs metadata so the orchestrator can assemble prompts reliably. 

### D2. Create a “skill compiler”
- Implement a function that composes:
  - agent role profile (system)
  - selected capability modules
  - hard rules (non-negotiables)
  - schema reminder

Why: Prevents prompt drift and ensures consistent behaviour across pipelines.

### D3. Reduce “aspirational” package references or label them clearly
Some skills mention packages that may not exist yet (e.g., `packages/seo-utils`, `packages/content-engine`, `packages/motion`). Either:
- create placeholders, or
- add a label: “planned in roadmap”.

Why: Avoids confusion for builders and prevents “dead-doc” syndrome.


---

## E. Resolve `gen-ui/system-prompt.md` properly (compiled, not handwritten)

### E1. Make `system-prompt.md` a generated artefact
- If the intent is “context compilation”, don’t hand-edit it.
- Generate it from:
  - ui-system component props/types
  - allowed component list
  - design tokens contract
  - output schema for UI blueprint

Why: The Generative UI skill explicitly calls for an “AI context builder” that updates prompts based on AST/code. 

### E2. Add a build step for context generation
- Wire `npm run ai:build-context` into:
  - precommit (optional)
  - CI (recommended)
  - or `turbo` pipeline (best)

Why: Keeps context in sync with code changes, which reduces hallucinations and mismatched component usage. 


---

## F. Establish “hard gates” vs “soft gates” by artefact type

### F1. Define gating policy
- Hard gate (throw on failure):
  - functional scope
  - technical specs
  - design tokens
  - UI code output
  - QA audits

- Soft gate (return non-approved for human review):
  - marketing drafts
  - exploratory content
  - optional animations

Why: Not all artefacts have the same risk profile. This prevents the system from either being too brittle or too lax. 


---

## G. Make the “Client Portal” real: wire traces + state into UI

### G1. Portal should render:
- current ProjectState (read-only)
- per-department status
- Maker/Checker traces (iteration timeline)
- last critiques and resolutions

Why: The roadmap explicitly calls for a Next.js portal to visualise state as it builds. 

### G2. Build an API contract for the portal
- `GET /state`
- `GET /state/events`
- `POST /pipeline/run` (or per-department endpoints)

Why: Avoids leaking orchestration details into the UI app. Keeps coupling low.


---

## Suggested File/Module Layout (target end-state)

### `packages/agency-core/`
- `state.ts` — ProjectState type + validation + ownership rules 
- `maker-checker.ts` — strict loop returning trace + result
- `orchestrator.ts` — runs department pipelines, commits state
- `events.ts` — append-only audit events

### `packages/design-architect/`
- `schemas/*` — zod schemas for design artefacts
- `pipeline.ts` — uses agency-core orchestration + maker-checker

### `tools/ai-context-builder/`
- compiles UI component contracts into prompt artefacts
- outputs into `packages/gen-ui/src/system-prompt.md` (generated)

### `packages/gen-ui/`
- runtime rendering of structured UI outputs
- guardrails (fallback states) 


---

## Quick Checklist (builder-friendly)

**Critical (do first)**
- [ ] Remove forced approval from Maker/Checker; return structured result or throw. 
- [ ] Add iteration trace return + optional `onEvent`.
- [ ] Implement `ProjectState` in `agency-core/state.ts` with slice ownership.

**Next**
- [ ] Update `design-architect` pipeline to use Maker/Checker and commit to state. 
- [ ] Treat `theme.json` as generated output, not primary contract.
- [ ] Add skill metadata (front matter) and a prompt composition function. 

**Then**
- [ ] Generate `gen-ui/system-prompt.md` via `ai-context-builder`. 
- [ ] Wire traces + state into the Client Portal “War Room”. 

---

## Open Decisions (need explicit choices)

1) **State persistence**
- In-memory only (dev)
- JSON file (simple)
- SQLite (robust local)
- Postgres (later)

2) **Artefact format for UI generation**
- structured JSON blueprint → renderer
- direct React code → QA AST parsing
- hybrid (recommended): blueprint first, code second

3) **Skill governance**
- skills versioning (semver)
- compatibility matrix (agent ↔ skill)
- CI checks for skill structure


---

## Final Note (architectural warning)

If you allow “forced approval” anywhere in the pipeline, you do not have an agency with guardrails — you have a text generator with extra steps. Remove that escape hatch early, and the rest of the design becomes much easier to reason about. [1](https://ampgroup-my.sharepoint.com/personal/reza_negarestani_amp_com_au/Documents/Microsoft%20Copilot%20Chat%20Files/02-product-owner.md)[2](https://ampgroup-my.sharepoint.com/personal/reza_negarestani_amp_com_au/Documents/Microsoft%20Copilot%20Chat%20Files/02-design-to-code.md)
