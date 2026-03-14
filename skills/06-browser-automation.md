# Skill: Browser Automation & Quality Control

**Description:** The ability to programmatically control browsers to simulate real user behavior, enforce UI stability, and automate repetitive quality assurance tasks at scale.

## 1. Core Competencies

* **End-to-End (E2E) Testing:** Writing resilient tests in Playwright or Cypress that interact with the DOM via accessibility selectors (e.g., `getByRole`, `getByLabelText`) rather than brittle CSS classes.
* **Visual Regression Testing:** Setting up baseline snapshots of UI components and automatically flagging pixel-level deviations in new commits.
* **Synthetic Monitoring:** Writing scripts that run on a cron job in production to simulate critical user flows (e.g., "Add to Cart" -> "Checkout") and page speed metrics, alerting the team if a flow breaks.
* **CI/CD Orchestration:** Integrating these automation scripts seamlessly into GitHub Actions or GitLab CI, managing test parallelization to keep build times fast.

## 2. Repo Implementation (`tools/browser-automation`)
* Houses a suite of Playwright scripts decoupled from the main app.
* Contains a daily synthetic monitoring script that logs into the staging environment, runs an a11y audit using Axe-core, and outputs a report.
* Runs automated visual diffs on the `@craft/ui-system` Storybook instance.
