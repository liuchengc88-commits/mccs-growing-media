# Full-Site Fixes: 14 October 2026

Base: merged main `954fc97fb37606cdb399f9faa97914e5af9e74e4`.
Branch: `codex/full-site-fixes-2026-10-14`.
Scope: the user's instruction to repair the strict full-site audit.

## Repairs

| Audit issue | Implemented correction |
| --- | --- |
| Conflicting binder claims | Neutral project-specific binder disclosure in the 28 material fields, generated CSV, relevant web copy and TDS. No assumption that all models use polyurethane. |
| Unsupported capacity number | Removed the unverified 100,000/day figure. Allocation and lead time require project confirmation; no substitute capacity was invented. |
| Two SGS report identifiers | Removed the unverified 302 reference from current summaries. Separately inspected the public 301 report (15-page source, first-page summary and stated sample limitations) and linked it as the public factory source. These are not represented as the same report. |
| Legal-page consent defaults | Added the existing consent initialization before GA on privacy and terms. Restored both stored choices and added reopenable preferences. Legal body text is unchanged. |
| Inactive human verification | Prepared native submission for Formspree-hosted reCAPTCHA. Authenticated settings confirmed CAPTCHA Disabled; not switched on before the compatible frontend deploys. Cutover remains pending. |
| Covered mobile form fields | Compact shared header and scroll padding. Arabic 320px model-link test landed the form at y=116 below the y=103 header. |
| Mobile catalog length | Six-model pagination, expandable model details, one complete collapsible specification table and collapsed video library. No duplicate 28-card mobile comparison. |
| Missing nearby inquiry action | Restored card and mobile-header sample CTAs. |
| Lost selected model | Approved model ID is passed to an optional form selector. Invalid IDs are ignored and buyer notes are not overwritten. |
| Incomplete localization | Translated all 28 catalog descriptions, tray guidance and UI for ES/AR/CN; numeric dimensions are preserved. Sixteen ES/AR guides now have complete local body copy, metadata and index cards. |
| Thin English guides | Expanded five existing guides with topic-specific sample, tray, packaging and shipping review steps, without invented trial outcomes. |
| Wrong evidence language links | Correct counterpart routes in source and shared navigation. |
| Missing packaging fragment | Stable packaging targets in four languages, plus internal fragment checking in the static audit. |
| Weak mobile home hierarchy | Short product name and primary CTAs precede the root photograph. At 390px the H1 begins at y=196 and the photo at y=518. |
| Floating button over form | WhatsApp is placed after contact-page content rather than over input controls. |
| Outdated TDS | Regenerated and visually reviewed all four pages; corrected the old ZY reference to CF. |

## Product And Integration Protection

- Only `material` changed in `data/products.json`.
- All other product fields, all 28 model identities, numeric dimensions, MOQ,
  carton quantities and names match the pre-change baseline exactly.
- The CSV's 28 rows match the JSON fields.
- Formspree endpoint `https://formspree.io/f/mredrnea` is unchanged.
- GA ID `G-JGR2SQBQHW` is unchanged.
- No Vercel settings, admin page or auto-merge workflow changed.
- Privacy/terms: consent initialization and removal of the redundant legacy
  acceptance-state writer only; all non-script markup and legal wording unchanged.
- ES, AR and CN buyer pages were intentionally touched.
- No new library or runtime dependency was added.

## Local Verification

- Static audit: 99 site pages, 95 sitemap URLs, zero errors or warnings.
- JSON-LD: 112 catalog model entities, no parse or model errors.
- Form tests: validation, hosted handoff, duplicate-submit prevention,
  back-navigation recovery, optional Turnstile lifecycle and analytics boundary.
- New invariant tests: protected product fields, dimension translations,
  model prefill and fallback, legal-page consent, returning-visitor preferences,
  sixteen translated/indexable guides and packaging fragments.
- Existing root-evidence and factory-demonstration generator tests passed.
- Full regeneration pipeline repeated without output drift.
- In-app browser: 36 core pages at 390x844 and 1280x800, plus 32 narrow-screen
  page checks at 320x740. 104 distinct viewport/route combinations had no
  horizontal overflow, duplicate H1 or visible broken images.
- Manually exercised catalog pagination/search, model-to-form selection,
  Arabic navigation and specification disclosure, and legal-page cookie choices.
- No live inquiry was sent. No production deployment, search indexing, traffic
  increase or mailbox delivery is claimed by these local checks.
- PR CI/Lighthouse results must be read separately in GitHub.

## Required After Manual Merge

Follow `docs/form-verification.md`: verify the native frontend on production,
enable Formspree's default hosted reCAPTCHA, then complete a human test and
separately verify server enforcement and accepted inquiry delivery.
Do not enable CAPTCHA against the old AJAX frontend.

Actual formulation/model mapping, current batch reports and production allocation
still require supplier evidence. The website now asks for that confirmation
instead of publishing unsupported universal specifications or capacity numbers.

## Public Source

[Factory-published SGS source PDF](https://www.ecopluggrow.com/wp-content/uploads/2026/10/XMIN2405000839CM01_EN2.pdf):
CANIN24009790301, 21 May 2024, submitted sample named “Cuttings of nursery stock”.
Its historical screening result is sample-specific, not certification of the
entire current CF range.
