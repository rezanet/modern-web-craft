# Modern Web Craft: Architecture & Philosophy

Welcome to the Modern Web Craft repository. This codebase is not a standard flat-file portfolio. It is a **Production-Grade Monorepo** designed to prove high-level frontend engineering skills through execution, abstraction, and strict separation of concerns.

## 🏗 High-Level Architecture

This repository uses a monorepo structure (managed via Turborepo/Nx). It separates our consumable applications from our underlying engineering systems. 

### The Structure

* **`apps/`**: The consumer-facing layers.
  * `showcase-web/`: The live Next.js/Nuxt application that imports and renders our internal packages. It proves that the systems work in a production environment.
  * `docs/`: A static documentation site (built with Astro or Starlight) that hosts our `skills/` markdown files and component library documentation.

* **`packages/`**: The core engineering systems. These act as internal `npm` packages, fully decoupled from the main application.
  * `@craft/ui-system`: Our headless component library and design token system.
  * `@craft/motion`: Reusable, accessible animation hooks and spatial (3D) components.
  * `@craft/content-engine`: MDX parsers and headless CMS integrations.
  * `@craft/gen-ui`: Context-aware LLM pipelines and Generative UI components.
  * `@craft/seo-utils`: Programmatic schema generation and metadata wrappers.

* **`tools/`**: Automation and CI/CD scripts.
  * `browser-automation/`: Playwright scripts for End-to-End testing and synthetic monitoring.
  * `ai-context-builder/`: Node scripts that compile our `ui-system` ASTs into system prompts for our LLMs.

* **`skills/`**: The theoretical foundation. Markdown files defining the competencies required to build and maintain this repository.

## 🧠 Core Philosophy

1. **Prove it with Code:** We don't just claim to know SEO or Accessibility; we build `@craft/seo-utils` and write automated Axe-core tests to prove it.
2. **Shift-Left Quality:** Performance, accessibility, and AI guardrails are built into the `packages/` level, not patched at the `apps/` level.
3. **Context-Aware AI:** AI is treated as an engineering component. It is strictly fed localized context via our `tools/ai-context-builder` to prevent hallucinations and enforce brand guidelines.
