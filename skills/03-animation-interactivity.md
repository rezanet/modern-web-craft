# Skill: Animation, Motion, & Interactivity

**Description:** The precise application of motion to enhance user experience, guide attention, and provide feedback, without compromising rendering performance or accessibility.

## 1. Core Competencies

* **Performance-First Motion:** Exclusively animating composite properties (`transform`, `opacity`) to avoid main-thread blocking and layout thrashing (Reflow/Repaint).
* **State-Driven Animation:** Orchestrating complex enter/exit animations based on the UI lifecycle (e.g., AnimatePresence in Framer Motion).
* **Micro-interactions:** Designing subtle feedback loops for hover, focus, and active states that make the UI feel tactile.
* **Spatial Web (Optional):** Integrating WebGL/Canvas elements via React Three Fiber for high-end, 3D interactive experiences.

## 2. Accessibility Guardrails
* **Reduced Motion:** Every animation is wrapped in a hook that checks the OS-level `prefers-reduced-motion` media query. If true, animations are gracefully degraded to simple opacity fades or instant transitions.

## 3. Repo Implementation (`packages/motion`)
* Exports a `useSpringTransition` hook for physics-based, natural-feeling UI updates.
* Houses global layout transition wrappers for smooth page routing.
