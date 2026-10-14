# Factory Content Review - 2026-10-14

## Source Review

- `https://www.ecoplug.com.cn/` redirected in the browser to `https://www.ecopluggrow.com/`.
- Reviewed the factory homepage, Materials & Testing, cutting-propagation page, research brief and the publicly linked SGS source.
- Compared those sources with the current MCCS homepage, evidence register, existing root photos and buyer guides. The 2025 PFAL research was already represented; it was not presented as a new study.
- The growing-cases link could not be independently verified during this session. It is not included as a new buyer destination, and a failed fetch is not reported as a confirmed broken page.
- Review date is 2026-10-14. October upload-directory paths do not establish filming or experiment dates.

## Material Selection

Four original, silent factory MP4 recordings are copied without trimming, retouching, rebranding or changing their overlays:

| Recording | Factory filename under `/wp-content/uploads/2026/10/` | Duration | Frame |
| --- | --- | --- | --- |
| Water absorption | `Eco_Plug_40_Second_Water_Absorption_EN.mp4` | 23.77 seconds | 720 x 1280 |
| Wet airflow | `Eco_Plug_Wet_Airflow_Smoke_Test_EN.mp4` | 11.50 seconds | 720 x 1280 |
| Nursery roots | `Eco_Plug_Nursery_Root_Development_EN.mp4` | 21.37 seconds | 576 x 1080 |
| Post-transplant roots | `Eco_Plug_Transplant_Growth_EN.mp4` | 28.00 seconds | 576 x 1080 |

The water-test source names a 40-second demonstration, but the edited file runs 23.77 seconds. The article does not infer a universal absorption time from the edited recording. The post-transplant source labels its scene as two weeks; the article preserves that attribution without treating it as a promised outcome for another crop.

Two new factory photographs (`454-ep-web-960.jpg` and `455-ep-web-960.jpg`) were visually inspected. They are upright portrait images; no extra rotation or crop was needed. Full-frame WebP derivatives are 480 x 854 and 960 x 1708 pixels. Original root and foliage geometry is retained. Four original video posters are converted to WebP without replacing their factory branding.

Homepage and evidence entries use one small photo, not autoplay or embedded video. Article players use `preload="none"`, native controls and `playsinline`; video data is not fetched until playback. PhotoSwipe reuses the existing local library for full-image viewing.

## Claims Kept Separate

- Factory homepage claims of 20%+ shorter nursery duration and higher survival are not republished as MCCS performance results. Crop identity, sample counts, trial dates, controls and full records were not available for review.
- Visible vapor is not presented as a numerical AFP, oxygen or airflow measurement.
- Raw-material EC is not copied into finished-plug specifications.
- Factory ZY dimensions and model names are not imported into the protected CF catalog.
- The public SGS PDF is report **CANIN24009790301**, dated 21 May 2024, for the factory's submitted sample. Existing MCCS summaries refer to **CANIN24009790302**. The public source is linked separately; existing report numbers and summaries are not silently replaced. The factory should reconcile the applicability of both documents before a buyer relies on a particular report.
- Report upload in October 2026 is not treated as a new October 2026 test. No blanket SGS certification or current-law compliance claim is added.

## Implementation

- One original buyer guide in English, Chinese, Spanish and Arabic: `insights/propagation-plug-wetting-transplant-root-guide/` and matching locale routes.
- Localized entry sections on all four homepages, insights indexes and technical-evidence pages, immediately after the existing hero.
- On narrow screens the new photo appears before the entry text. Text does not overlay roots.
- Reciprocal language links, canonical, Open Graph image/alt/dimensions, Article/BreadcrumbList/FAQPage JSON-LD and four sitemap additions.
- Spanish and Arabic EC/pH references use the existing English protocol and clearly label its language rather than linking to nonexistent translated pages.
- No VideoObject is fabricated: original upload dates are not confirmed.
- Content comes from `data/factory-demonstrations.json`. `sync-factory-demonstrations.mjs` generates articles and idempotent entries. Existing Chinese/trust generators preserve those entries.
- Existing sitemap dates outside the 12 changed entry pages are preserved; new article dates use 2026-10-14.

## Verification

- `python scripts/audit-site.py`: 99 HTML pages, 79 sitemap URLs, 112 catalog model entities, 0 errors / 0 warnings.
- `node scripts/audit-json-ld.mjs --strict`: no JSON-LD parse errors or invalid catalog entities.
- Form-protection, existing root-generator and new factory-generator regression tests passed.
- New test covers four languages, local media URLs, source scope, video loading, schema, repeat-generation stability and preservation after Chinese/trust regeneration.
- Existing CI generators were run. After matching image markup to repository rules, the image optimizer changed 0 files. Protected product data and catalog content have no Git diff.
- Browser layout matrix: 16 related pages at 320px and 1280px, with no horizontal page overflow or clipped CTA labels. All new images loaded with contain sizing. Mobile entry layout was rechecked after the image-first adjustment.
- All four native players loaded H.264 content, reached readyState 4 and advanced playback time with no media error.
- Arabic mobile PhotoSwipe opened with localized close/zoom/previous/next controls; full root imagery was visible.
- Screenshot evidence is in the ignored `outputs/factory-review/` folder. Local verification is not production deployment or proof of ranking/traffic improvement.

## Protected Scope

No changes to `data/products.json`, CF dimensions, MOQ, carton quantities, Formspree endpoint or script, GA ID `G-JGR2SQBQHW`, Vercel configuration, admin, privacy or terms pages. Production was not modified. All changes go through a separately reviewed PR; no automatic merge.

## Pre-Merge Review Follow-Up

The automated review of PR #47 identified a third-party trademark used as the subject of a comparison caption. All four captions now use neutral "factory molded-plug sample" wording. Source attribution and original media branding remain intact, without turning the supplier trademark into a named buyer case. A regression assertion prevents that trademark from returning to comparison captions.

A second review identified that temporary generation alone would not detect stale checked-in HTML. The factory regression test now compares all 16 generated article/entry files against their repository counterparts, normalizing line endings only. The CI synchronization step also runs the factory synchronizer before `git diff --exit-code`, so changing source copy without regenerating buyer pages cannot pass the gate.

The final follow-up also rejects untracked generated files: CI explicitly checks `git ls-files --others --exclude-standard`, and the factory test requires all 16 buyer pages to be tracked. Regeneration cannot conceal an article accidentally omitted or deleted from the commit by recreating it as an untracked file.

GitHub Site Quality Audit and its PR Lighthouse gate passed for the initial commit. A new head revision must pass the same checks after the caption correction. The Vercel preview is reported Ready by GitHub, but rendered preview verification is unavailable in this session because Vercel requires reauthentication. Local browser verification and a local review server remain available; this does not weaken or disable deployment protection.
