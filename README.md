# 🚀 Modern Web Craft: The Autonomous Digital Agency

> ⚠️ **ALPHA RELEASE NOTICE**
> This repository is in active development. The core **Maker/Checker AI Engine**, shared memory orchestration, and Phase 1-3 agents (Product & Creative Departments) are fully operational. We are currently building out the downstream production agents (Phase 6: PDF Brand Book Generation, Social Assets). Feel free to fork and explore the `@craft/agency-core` package to see how state-driven AI orchestration is implemented!

This is a **Production-Grade Monorepo** designed to act as an autonomous, self-correcting Digital Agency. It solves the "Generic AI Aesthetic" and "Hallucination" problems by wrapping Large Language Models in strict software engineering guardrails and multi-agent peer review.

By utilizing Zod validation, Shared State Memory, and an **Actor/Critic (Maker/Checker) AI Architecture**, this repository forces LLMs to output highly polished, brand-consistent, and functionally complete enterprise artifacts.

## 🌟 The Agency Departments
1. **Strategy & Product:** Business Analysts and CTOs define the scope, technical requirements, and target audience.
2. **Creative & Brand:** Brand Strategists and Architects define the emotional resonance, tone of voice, and mathematical design tokens (WCAG-compliant colors, typography).
3. **Marketing & Copy:** Marketing Directors and Copywriters generate SEO-optimized, tone-compliant content strategies and text.
4. **Engineering & QA:** UI Builders and QA Auditors generate interactive React components and verify them against strict accessibility standards.

## 🛡️ The "Maker/Checker" Guarantee
No artifact moves to the next phase without approval. A "Maker" agent generates the artifact (e.g., a Design System), and a "Checker" agent (The Creative Director) critiques it against the client's original brief. If it fails, the Maker must revise it.

## 🏗️ Repository Structure

```text
modern-web-craft/
├── apps/
│   └── showcase-web/         # Next.js Client Portal (The "War Room" Dashboard)
├── packages/
│   ├── agency-core/          # Global ProjectState, Memory Storage, and Maker/Checker Engine
│   ├── design-architect/     # Creative Dept. pipelines and Zod Schemas (Brand/Strategy)
│   ├── gen-ui/               # Engineering Dept. (AI Live-Rendering Engine)
│   ├── theme-core/           # Compiler that translates Agent JSON into strict CSS variables
│   └── ui-system/            # Headless, accessible React components for the AI to compose
├── skills/
│   ├── agents/               # Markdown files acting as the "Brains" (System Prompts) for Agents
│   └── ...                   # Theoretical guidelines and standards
└── tools/
    ├── ai-context-builder/   # AST parser that injects strict codebase rules into the LLM
    └── browser-automation/   # Playwright E2E and visual regression tests
```

## 🚀 Getting Started
*See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design, [USE_CASES.md](./USE_CASES.md) for agency operations, and [ROADMAP.md](./ROADMAP.md) for our rollout plan.*
