# Root evidence placement and open-source review

Base: origin/main 5cdedfd. Scope: four locales (EN, CN, ES, AR), homepage,
product listing, sample/shipping, and Yunnan article: 16 pages.

## Placement

- Preserve the existing root-development homepage hero and its first-load priority.
- Replace the single landscape Yunnan preview with two complete portrait close-ups
  immediately after the hero. Keep roots visible without cropping or retouching.
- Add a restrained evidence band at the end of products and sample/shipping,
  without pushing the catalog or shipping information further down.
- Link photographs to the localized seven-photo/video article. The article gets
  PhotoSwipe zoom and navigation; no association to a specific CF model is implied.

## Open-source selection

- Integrated PhotoSwipe 5.4.4: https://github.com/dimsemenov/PhotoSwipe
  MIT license retained, pinned npm release, unmodified local distribution files.
  Core loads on demand. Localized controls, reduced-motion support and original
  image links remain available without JavaScript. No tracking or CDN added.
- Considered Pagefind: https://github.com/pagefind/pagefind
  Deferred: requires an indexing build step and search UX, outside this image-focused
  improvement; existing product filters already serve model selection.
- Considered Pa11y: https://github.com/pa11y/pa11y
  Deferred as a future audit tool, not a production dependency. This review does not
  claim a complete WCAG conformance audit.

## Checks and limits

- Site audit: 91 HTML pages, 71 sitemap URLs, 112 catalog entities, 0 errors/warnings.
- Strict JSON-LD audit and form-protection tests pass.
- Existing Yunnan metadata/image validation passes; image normalizer changes 0 files.
- Existing catalog, consent and content generators do not introduce additional diffs.
- Render tests cover all 16 affected pages at 390 and 1440 pixels: 32 checks.
  All new preview/lead images decode; no horizontal overflow. All four article
  lightboxes open, advance to image 2 of 7 and close with Escape at both widths.
- Manual screenshots inspected: homepage desktop/mobile and Arabic sample page mobile.
- JavaScript-disabled HTML retains a direct image link with a successful HTTP response;
  automatic navigation through that link was not conclusively verified.
- Follow-up overlap fix: homepage captions now follow the complete image in normal
  flow on EN/ES/AR; CN already uses a separate media frame. Removed the inherited
  fixed-height image crop. Language suggestions and existing cookie notices now sit
  in document flow before page content, rather than covering imagery/navigation.
- Re-audited all 71 sitemap buyer routes at 360/768/1440px: 213 checks, no horizontal
  overflow, measured heading/button overflow or homepage caption/image intersection.
  This is an automated layout scan, not a manual screenshot review of every section.
- Inspected corrected EN/ES/AR mobile hero screenshots. Tested menu toggling and
  language dismissal on all four homepages, plus accept/reject/close for the existing
  EN/ES/AR cookie notices. CN homepage has no existing cookie banner and none was added.
  Closing leaves consent unset; accept/reject storage semantics remain unchanged.
- No new URLs, so sitemap membership/canonicals/hreflang remain unchanged.
- Protected product data, dimensions, MOQ, carton quantities, Formspree endpoint,
  GA ID, Vercel configuration, admin and legal pages remain unchanged.
- No performance-score or ranking improvement claimed. Remote CI and production
  rendering must be checked after PR creation/deployment; no automatic merge.
