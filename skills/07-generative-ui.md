# Skill: Generative UI & AI Frontend Architecture

**Description:** The ability to integrate Large Language Models (LLMs) into the frontend workflow to generate context-aware, on-brand, and accessible user interfaces. This skill moves beyond basic prompt engineering to focus on programmatic context-injection, structured outputs, and Generative UI patterns.

---

## 1. Core Competencies

### Advanced Prompt Architecture for Code
* **System Context Compilation:** Programmatically generating system prompts by reading ASTs (Abstract Syntax Trees) or documentation from local design systems.
* **Few-Shot Prompting for UI:** Guiding LLMs with strict, high-quality code examples to enforce accessibility (WCAG) and brand guidelines.
* **Structured Outputs:** Forcing LLMs to return strict JSON matching Zod schemas to guarantee predictable rendering of UI components.

### Generative UI Implementation
* **UI Streaming:** Using tools like Vercel AI SDK to stream React Server Components (RSC) directly to the client instead of plain text.
* **Tool Calling (Function Calling):** Granting the AI the ability to trigger local frontend state changes or fetch external APIs (e.g., pulling live CMS data into an AI-generated layout).
* **Fallback UI:** Architecting loading skeletons and error boundaries specifically for AI latency and generation failures.

### Design-to-Code Automation
* **Figma to LLM Pipelines:** Exporting Figma variables/JSON and injecting them into the AI's context window so it understands the brand's exact spacing, colors, and typography.
* **Guardrailing Output:** Writing post-generation parsers that lint the AI's output with ESLint and Stylelint to ensure it meets production standards before rendering.

---

## 2. Tooling Ecosystem

* **AI SDKs:** Vercel AI SDK, LangChain.js, OpenAI Node SDK, Anthropic SDK.
* **Validation:** Zod (for validating AI JSON outputs).
* **Parsing:** AST parsers (to read local codebase structure).
