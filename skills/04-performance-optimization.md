# Skill: Performance Architecture & Web Vitals

**Description:** The ability to architect applications that load instantly and respond to user interactions immediately, regardless of network conditions or device capabilities. This goes beyond basic minification to encompass rendering strategies and deep metric optimization.

## 1. Core Competencies

* **Rendering Patterns:** Mastery of when to use Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), or Client-Side Rendering (CSR) based on data freshness and SEO requirements.
* **Asset Optimization:** * Implementing aggressive image optimization (AVIF/WebP, responsive `srcset`, lazy loading).
  * Font loading strategies (`font-display: swap`, preloading critical fonts, subsetting).
* **Core Web Vitals Mastery:**
  * **LCP (Largest Contentful Paint):** Optimizing the critical rendering path and preloading hero assets.
  * **CLS (Cumulative Layout Shift):** Strictly defining aspect ratios for media and reserving space for dynamic content.
  * **INP (Interaction to Next Paint):** Yielding to the main thread, breaking down long JavaScript tasks, and deferring non-critical scripts.
* **Bundle Analysis:** Using tools like Webpack Bundle Analyzer or Vite's rollup plugins to tree-shake unused code and dynamically import heavy libraries.

## 2. Repo Implementation (`apps/showcase-web` & `.github`)
* The consumer app uses dynamic imports (`next/dynamic` or `React.lazy`) for below-the-fold components.
* A GitHub Action runs Lighthouse CI on every Pull Request. If the performance score drops below 95, the PR is blocked.
