# Skill: Design-to-Code & Styling Architecture

**Description:** The ability to translate static design files (Figma/Penpot) into scalable, semantic, and highly maintainable code. This skill focuses on building systems rather than one-off pages, relying heavily on design tokens and headless architecture.

## 1. Core Competencies

* **Design Token Architecture:** Extracting raw values (colors, spacing, typography) from design tools and structuring them as platform-agnostic JSON or CSS variables (`:root`).
* **Headless UI Implementation:** Separating accessibility and logic from visual styling by utilizing unstyled primitives (e.g., Radix UI, React Aria).
* **Systematic Styling:** Writing utility-first CSS (Tailwind) or CSS-in-JS that strictly adheres to the token system, preventing "magic numbers" in the codebase.
* **Component APIs:** Designing React/Vue component props that are intuitive for other developers and mirror the variants defined by designers in Figma.

## 2. Repo Implementation (`packages/ui-system`)
* Contains a fully documented `Storybook` instance.
* Exports a strictly typed `<ThemeProvider>` that injects our CSS variables globally.
* Includes visual regression tests (Chromatic/Percy) to catch unintended styling changes across the monorepo.
