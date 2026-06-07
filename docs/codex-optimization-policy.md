# Codex Optimization Policy

This policy defines how Codex should optimize the MCCS Growing Media repository. It applies to all future website, SEO, content, UX and automation work.

## Before Every Optimization

Codex must inspect the relevant current `main` files before editing. At minimum, check:

- `AGENTS.md`
- The page or script requested by the user
- `data/competitors.json` when using competitor audit findings
- `.github/workflows/competitor-audit.yml` when changing automation behavior
- `scripts/competitor-audit.mjs` when changing audit logic
- `scripts/site-optimizer.mjs` when changing automatic optimization behavior
- `data/products.json` only for read-only verification when product references are involved
- Existing page head metadata before changing SEO titles or meta descriptions
- Existing forms before editing contact or inquiry pages
- Existing tracking snippets before editing page head content

If the task could affect a protected area, Codex must explicitly verify the protected values before creating a PR.

## Files and Data That Must Not Be Changed

Never modify these unless the user explicitly requests that exact file or value:

- `data/products.json`
- Product model names
- Product dimensions or sizes
- MOQ values
- Carton quantity or quantity-per-box values
- Formspree endpoint
- Google Analytics ID: `G-JGR2SQBQHW`
- Vercel configuration
- `/admin.html`
- `/privacy.html`
- `/terms.html`

Also avoid changing:

- `/ar/` and `/es/` pages unless the user asks for multilingual work
- Legal, privacy, admin or internal utility pages unless explicitly requested
- Any product specifications embedded in static pages unless the task is specifically to correct approved data

## High-Risk Changes

Treat these as high-risk and do not perform them without explicit user approval:

- Editing `data/products.json`
- Changing product model names, sizes, MOQ or carton quantities
- Changing form submission endpoints or form field names that may affect lead capture
- Changing Google Analytics or tracking snippets
- Changing Vercel or deployment settings
- Deleting pages, assets, product data or scripts
- Rewriting multilingual pages at scale
- Adding performance claims, certifications or customer proof that is not already supported
- Creating fake case studies, fake testimonials or simulated customer stories presented as real
- Adding third-party marketplace trademarks as case-study titles or implied channel claims
- Publishing internal notes, demo labels, preview text or unfinished-state copy to buyer-facing pages

## Safe Automatic Optimization Areas

When scoped to the user's request, these changes are normally safe:

- SEO title improvements
- Meta description improvements, ideally around 120-165 characters
- H1 and H2 clarity improvements
- CTA wording improvements
- FAQ additions or refinement
- Internal link improvements
- Insights article improvements
- Contact, Sample & Shipping and Private Label conversion copy
- Image alt text improvements
- Mobile UX improvements
- Buyer trust copy using approved language: factory-direct supply, SGS report available, 20,000-unit daily reference capacity and export coordination

Safe changes must still preserve all product data and integrations.

## Priority Framework

High Priority pages:

- `/`
- `/products/`
- `/sample-shipping/`
- `/private-label/`
- `/contact/`
- `/insights/`
- `/about/`

Medium Priority work:

- Product subpages
- Insights articles
- Internal links
- FAQ expansion
- Image alt text

Low Priority work:

- `/es/`
- `/ar/`
- Multilingual page fine-tuning

Ignore during optimization unless explicitly requested:

- `/admin.html`
- Invalid competitor URLs
- Fetch-failed competitor pages
- Internal pages not intended for buyers

## PR Creation Rules

All changes must be submitted through Pull Requests. Do not push directly to `main`.

Each PR description must include:

- What changed
- Why it changed
- Exact pages or files modified
- Whether product data was changed
- Confirmation that product models, dimensions, MOQ and carton quantities were not modified
- Confirmation that `data/products.json` was not modified
- Confirmation that Formspree endpoint was not modified
- Confirmation that GA ID `G-JGR2SQBQHW` was not modified
- Confirmation that Vercel configuration was not modified
- Confirmation whether `/ar/`, `/es/`, `/admin.html`, `/privacy.html` or `/terms.html` were touched

For page optimization PRs, list changes page by page.

## Human Review Checklist Before Merge

Before merging any PR, the reviewer should check:

- Changed files match the stated scope.
- `data/products.json` is unchanged unless explicitly requested.
- Product model names, sizes, MOQ and carton quantities are unchanged.
- Formspree endpoint is unchanged.
- GA ID remains `G-JGR2SQBQHW`.
- Vercel configuration is unchanged.
- Buyer-facing copy does not contain internal notes, demo labels, preview text or unfinished-state wording.
- No third-party trademark is used as a fake case-study title or buyer proof.
- No simulated customer case is presented as real.
- SEO title and meta description match the page intent.
- CTA wording is consistent, preferably `Request Sample`, `Compare Models` or `Contact Sales`.
- Vercel Preview renders correctly on desktop and mobile.

## After Merge

After a PR is merged into `main`, Vercel deploys the production site automatically. Review the deployment and confirm key pages still render correctly.
