# Yunnan rooted-cuttings content review

Date: 2026-09-22. Base: origin/main fda178c. Branch: codex/yunnan-rooting-field-notes.

## Scope

- New original-media article in English, Chinese, Spanish and Arabic.
- A matching entry on each homepage and Insights index (12 HTML pages total).
- Seven photos at two responsive widths, one upright silent web video and its poster, scoped CSS, sitemap entries, and a validation script.
- No product model, dimensions, MOQ, carton quantity or data/products.json changes. Formspree endpoints, GA ID, Vercel configuration, admin and legal pages remain unchanged.

## Evidence and media

The owner supplied seven original photographs and a video from a Yunnan exhibition visit, identifying the specimens as applications of their propagation product. No exhibit name, crop identity, rooting duration, rooting rate, model, size or trial protocol was supplied. The article does not invent these details or describe a controlled comparison.

The first three photographs were rotated counterclockwise; the remaining four were already upright. All retain the full source frame. No roots were added, removed, generated or retouched. EXIF data is omitted from web derivatives; original user files remain unchanged. Responsive WebP versions are 640 and 1280 pixels wide, with explicit dimensions, descriptive alt text, lazy loading for secondary images and contain sizing. The lead image loads eagerly on the article page.

Video: original duration approximately 32.16 seconds; the display rotation was baked into a 540 x 960 H.264 web copy with fast-start metadata, 24 fps and no audio. This silent presentation is disclosed in each language. The original video remains unchanged. Web copy: 4,295,641 bytes versus 6,710,020 original bytes. The HTML player has controls, playsinline, a poster and preload=none; it does not autoplay. The surrounding text describes what is visible rather than claiming a strength test.

## Search and AI-readability

Localized descriptive titles and descriptions, self-canonicals, reciprocal four-language hreflang and x-default, Article and BreadcrumbList structured data, visible evidence-scope table, buyer questions, sample-trial steps, source attribution, relevant internal links and sitemap inclusion. No fabricated reviews, certifications, test percentages or model claims. No claim of guaranteed AI citations or ranking gains.

References reviewed:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/video
- https://developers.google.com/search/docs/appearance/google-images

## Verification

- scripts/validate-yunnan-media.py: 12 HTML pages, 71 sitemap URLs, no missing local resources, one H1 per page, all article language alternates and seven article images present.
- scripts/audit-json-ld.mjs: zero JSON-LD parse errors; zero invalid catalog model entities.
- Browser checks at 390px and 1440px: four articles, four homepages and four Insights indexes show no horizontal overflow; localized links target the matching new article.
- Screenshots inspected: English mobile article, Arabic mobile/desktop article, English desktop photo gallery and homepage entry. Upright photos preserve roots and full source frames.
- Browser video test reached the end at 32.166667 seconds, 540 x 960, without a media error.
- Review confirms buyer-facing text distinguishes observed roots from unmeasured outcomes. Original crop and model data are not inferred from photos.

## Release boundary

Local validation does not prove production deployment or indexing. Create a PR, review its final diff and checks, and do not merge automatically. After merge/deploy, verify the four live article URLs and request indexing only if appropriate. Native-speaker review of localized editorial wording remains advisable.
