# Skill: SEO & Content Engineering

**Description:** The systematic approach to ensuring content is discoverable, semantic, and highly structured for search engines and social platforms. This treats SEO not as a marketing afterthought, but as a core engineering requirement.

## 1. Core Competencies

* **Technical SEO:** Managing `robots.txt`, dynamic XML sitemaps, and canonical URLs to prevent duplicate content penalization.
* **Structured Data (JSON-LD):** Programmatically generating Schema.org markup (e.g., Articles, Products, Breadcrumbs, FAQs) to enable rich snippets in Google Search.
* **Dynamic Meta & Open Graph:** Creating automated fallback systems for `<title>`, `<meta description>`, and Open Graph tags (for Twitter/LinkedIn sharing).
* **Content Architecture (MDX):** Building parsers that allow non-technical teams to write Markdown that safely renders complex, interactive React components.

## 2. Repo Implementation (`packages/seo-utils` & `packages/content-engine`)
* Exports a `<SEO />` wrapper component that enforces strict prop requirements for metadata.
* Contains a utility that automatically generates dynamic OG Images at the edge using Vercel Satori.
* Provides a secure MDX processing pipeline that sanitizes inputs before rendering interactive widgets.
