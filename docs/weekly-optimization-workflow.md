# Weekly Optimization Workflow

This document defines the weekly optimization process for MCCS Growing Media.

## Goal

Use competitor audit findings to improve the English main-site buyer journey while protecting product data, lead capture, tracking and deployment settings.

## Weekly Process

### 1. Run Competitor Audit First

Start each weekly cycle by running the competitor audit workflow.

Default behavior should be report-only:

- Generate competitor audit report.
- Upload the report artifact.
- Do not change website pages.
- Do not create an optimization PR unless `apply_changes` is intentionally enabled or the run is a scheduled automation run.

### 2. Review the Report

Review the generated report before editing the site.

Focus on these sections:

- High Priority: English Main-Site Conversion and SEO
- Medium Priority: Product Pages, Insights and Internal Links
- Low Priority: Multilingual Page Fine-Tuning
- Ignore: Admin and Invalid Competitor URLs

Confirm that the report direction is useful and commercially accurate before creating any page optimization PR.

### 3. Optimize Only High Priority English Pages First

The first optimization PR after a weekly audit should only handle High Priority English main-site recommendations unless the user explicitly asks otherwise.

High Priority pages:

- `/`
- `/products/`
- `/sample-shipping/`
- `/private-label/`
- `/contact/`
- `/insights/`
- `/about/`

Allowed work in this phase:

- SEO title
- Meta description
- H1 and H2 copy
- CTA copy
- FAQ
- Internal links
- Buyer trust copy
- Image alt text when relevant
- Contact, Sample & Shipping and Private Label conversion copy

### 4. Keep Protected Data Untouched

Weekly optimization must not modify:

- `data/products.json`
- Product model names
- Product dimensions or sizes
- MOQ values
- Carton quantity or quantity-per-box values
- Formspree endpoint
- Google Analytics ID `G-JGR2SQBQHW`
- Vercel configuration
- `/admin.html`
- `/privacy.html` and `/terms.html` unless explicitly requested
- `/ar/` and `/es/` unless the user requests multilingual work

### 5. Create a Pull Request

All optimization changes must be submitted through a PR.

The PR must explain:

- Which pages changed
- What changed on each page
- Why the changes were made
- Whether product data was affected
- Confirmation that protected data and integrations were not changed

Do not push directly to `main`.

### 6. Review Vercel Preview

After the PR is created, check the Vercel Preview before merging.

Review at least:

- Desktop layout
- Mobile layout
- Header and navigation
- CTA visibility
- Contact form visibility
- FAQ readability
- Internal links
- No unfinished or internal wording on buyer-facing pages

### 7. Merge Manually Only

Do not auto-merge into `main`.

A human reviewer must approve and merge the PR after checking:

- Scope is correct
- Product data is untouched
- Formspree endpoint is unchanged
- GA ID remains `G-JGR2SQBQHW`
- Vercel config is unchanged
- Vercel Preview looks correct

### 8. Production Deployment

After merge, Vercel automatically deploys `main` to production.

After deployment:

- Open the production site.
- Check the changed pages.
- Confirm forms, CTAs and key internal links still work.
- Record any follow-up issues for the next PR.

## Medium and Low Priority Work

Medium Priority work can be handled after High Priority English main-site recommendations are reviewed:

- Product subpages
- Insights articles
- Internal links
- FAQ expansion
- Image alt text

Low Priority multilingual work should be separate from English main-site optimization:

- `/es/`
- `/ar/`
- Translation consistency
- Minor SEO and CTA alignment

## Ignore Rules

Do not spend optimization effort on:

- `/admin.html`
- Invalid competitor URLs
- Fetch-failed competitor pages
- Internal pages not intended for buyers

If a competitor URL fails repeatedly, mark it as ignored or replace it in `data/competitors.json` through a separate PR.
