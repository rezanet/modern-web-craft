# Skill: Generative UI & AI Context Engineering

**Description:** The integration of Large Language Models (LLMs) into the frontend workflow. This bridges the gap between AI generation and rigid design systems, ensuring outputs are on-brand, accessible, and output as interactive code rather than static text.

## 1. Core Competencies

* **Context Compilation (RAG for UI):** Programmatically reading the codebase's Abstract Syntax Trees (AST) to feed the LLM exact component schemas and props before it generates code.
* **Structured UI Output:** Forcing the LLM to return strictly typed JSON (using Zod) that maps directly to frontend component rendering.
* **AI UI Streaming:** Using tool-calling and stream processing to render UI components on the client as the AI thinks, creating a seamless user experience.
* **Guardrailing:** Implementing fallback UI states (Skeletons/Error Boundaries) to handle LLM latency, timeouts, or malformed JSON responses.

## 2. Repo Implementation (`packages/gen-ui` & `tools/ai-context-builder`)
* `ai-context-builder` runs on a pre-commit hook, updating a `system-prompt.txt` file with the latest definitions of our `@craft/ui-system`.
* `gen-ui` contains a `<ChatRenderer />` component that parses the LLM's structured output and dynamically renders the correct internal React components.
