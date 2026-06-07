# MCCS Automation Guide

This repository includes a weekly competitor audit and conservative site optimization workflow.

## What It Does

- Audits configured competitor pages once per week.
- Supports manual runs from GitHub Actions.
- Extracts page structure, SEO title, meta description, H1, headings, product/category signals, CTA text, FAQ content, trust signals, selling points and image layout signals.
- Compares competitor patterns with the current MCCS static site pages.
- Writes timestamped audit reports under `reports/competitor-audit/`.
- Applies only conservative HTML improvements for SEO, CTA, FAQ and internal links.
- Opens a Pull Request with a summary of what changed and why.

## Safety Rules

The automation is designed to avoid high-risk commercial data changes.

It must not:

- Push directly to `main`.
- Delete existing pages.
- Modify product parameters, model names, dimensions, MOQ or carton quantity data.
- Modify `data/products.json`.
- Modify Formspree endpoints.
- Modify the Google Analytics ID.
- Modify Vercel configuration.

Every automatic change is submitted through a Pull Request for review.

## Schedule

The workflow runs every Monday at 02:00 UTC by default:

```yaml
cron: '0 2 * * 1'
```

You can also run it manually from GitHub:

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Competitor Audit and Site Optimization**.
4. Click **Run workflow**.
5. Keep `apply_changes` enabled if you want the optimizer to prepare page edits.

## Competitor List

Competitors are configured in `data/competitors.json`.

To add a competitor, add an object like this:

```json
{
  "name": "Competitor Name",
  "baseUrl": "https://www.example.com",
  "enabled": true,
  "pages": ["/", "/products/"]
}
```

Set `enabled` to `false` to keep a competitor in the file without auditing it.

## Reports

The audit writes these files:

- `reports/competitor-audit/latest.json`
- `reports/competitor-audit/latest.md`
- `reports/competitor-audit/latest-pr-body.md`
- Date-stamped JSON and Markdown snapshots

The Pull Request body is generated from `latest-pr-body.md`.

## Reviewing PRs

Before merging an automation PR, check:

- Product specs, model names, dimensions, MOQ and carton quantity remain unchanged.
- Formspree endpoint remains unchanged.
- Google Analytics ID remains unchanged.
- Page copy still matches MCCS real capabilities.
- New FAQ or CTA copy is commercially accurate.
- Internal links point to existing pages.

## Running Locally

Use Node.js 20 or newer.

```bash
node scripts/competitor-audit.mjs
APPLY_CHANGES=true node scripts/site-optimizer.mjs
```

If `APPLY_CHANGES` is not set to `true`, the optimizer writes a dry-run report but does not edit HTML files.
