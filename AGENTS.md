# MCCS Growing Media Codex Rules

Codex must read this file before handling any task in this repository.

## Site Positioning

MCCS Plug / MCCS Growing Media is a B2B independent website for a factory-direct molded coconut coir and peat substrate plugs supplier. The site serves buyers sourcing substrate plugs for hydroponics, nurseries, orchids, tissue culture, succulents, private label programs and B2B export purchasing. Primary target markets are North America and the Middle East.

## Required Workflow

- Always work from the latest `main` branch state.
- All changes must go through a Pull Request.
- Do not push directly to `main`.
- Do not enable auto-merge or merge automatically.
- Before editing, identify whether the request affects product data, contact forms, tracking, deployment or buyer-facing copy.
- PR descriptions must clearly state which pages changed, why they changed and whether product data was affected.

## Priority Rules

High Priority:

- `/`
- `/products/`
- `/sample-shipping/`
- `/private-label/`
- `/contact/`
- `/insights/`
- `/about/`

Medium Priority:

- Product subpages
- Insights articles
- Internal links
- FAQ expansion
- Image alt text

Low Priority:

- `/es/`
- `/ar/`
- Multilingual page fine-tuning

Ignore:

- `/admin.html`
- Invalid competitor URLs
- Fetch-failed pages
- Internal pages not intended for buyers

## Permanent No-Edit Rules

Do not modify these files, settings or data unless the user explicitly asks for that exact change:

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

## Content Restrictions

- Do not use Amazon or other third-party trademarks as case-study titles or buyer-case examples.
- Do not write simulated customer cases as real customer cases.
- Do not publish developer notes, internal instructions, demo labels, sample testimonials, preview wording or unfinished-state messaging on the buyer-facing website.
- Do not imply certifications, documents, customers, performance data or case results that are not already supported by site-approved claims.

## Allowed Optimization Areas

Codex may optimize the following when scoped to the requested task and protected data is untouched:

- SEO title
- Meta description
- H1 and H2 copy
- CTA copy
- FAQ copy
- Internal links
- Insights articles
- Contact, Sample & Shipping and Private Label conversion copy
- Image alt text
- Mobile UX
- English main-site buyer trust language, including factory-direct supply, SGS report available, 20,000-unit daily reference capacity and export coordination

## Buyer-Facing Copy Preferences

- Prioritize English main-site pages before multilingual pages.
- Use clear B2B sourcing language.
- Prefer CTA wording such as `Request Sample`, `Compare Models` and `Contact Sales`.
- Keep copy commercially conservative and verifiable.
- Mention MOQ, carton quantity, sizes or model specifications only by preserving existing approved data, not by inventing or changing values.

## Pull Request Requirements

Every PR must include:

- Summary of changed pages or files.
- Reason for each meaningful change.
- Explicit confirmation whether product data was changed.
- Confirmation that `data/products.json`, Formspree endpoint, GA ID and Vercel config were not changed when applicable.
- Note whether multilingual pages, legal pages or admin pages were touched.

## Final Safety Check Before PR

Before creating a PR, confirm:

- No direct push to `main`.
- No protected product data changed.
- No protected integrations changed.
- No disallowed public-facing internal wording was added.
- Changed files match the user's requested scope.
