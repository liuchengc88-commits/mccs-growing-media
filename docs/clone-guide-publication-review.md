# Clone Plug Buyer Guide: Pre-Merge Review

Reviewed locally on October 6, 2026. Production publication still requires PR review, merge and deployment verification.

## Scope

- New `cannabis-clone-plug-selection` article in English, Chinese, Spanish and Arabic; matching Insights listings, language routes and sitemap entries.
- One AI illustration, visibly labeled as generated and not a trial result. The original rooted-cutting photos are separately labeled and are not identified as cannabis.
- Blank CSV procurement-observation record; no fabricated results, model specifications or cultivation recipe.
- Related links on the existing English cannabis application page.
- Shared consent and language notices stay after the footer instead of moving the first viewport. Consent defaults remain denied, and acceptance/rejection behavior is retained. CSV downloads use the existing resource-download event.
- Existing cutting-observation articles in four languages received only image-markup normalization required by the current quality pipeline.
- Root-development gallery: removed its decorative hero background and glass effect so the real root photograph is the visual focus; the lead photograph is shown uncropped. Its WhatsApp link is in page flow below the footer rather than floating over photographs or captions. Other pages keep their current WhatsApp placement. Lighthouse artifacts now include the hidden report directory. Existing audit score thresholds are unchanged.

## Verification

- Static audit: 99 HTML pages, 79 sitemap entries, 112 catalog-model schema entities; zero errors or warnings.
- Strict JSON-LD audit and existing form-protection tests passed.
- New articles tested at 360, 390, 1440 and 1920 pixels in all four languages: image loading, uncropped lead image, horizontal overflow, canonical/hreflang, visible FAQ/schema consistency, PhotoSwipe opening/Escape closing, section links, CSV download and event recording passed.
- Four-locale home, products, contact and Insights pages tested on mobile with a delayed language manifest: menus work, translation suggestion remains outside main content, WhatsApp remains visible and measured layout shift is zero.
- Accept, reject and close were tested separately. Accept/reject persist; closing does not grant consent.
- Local mobile Lighthouse single-run samples: homepage performance 86, accessibility 95, best practices 100, SEO 100; English article 99/96/100/100; Arabic article 98/96/100/100. All three measured CLS 0. These are lab results, not field Core Web Vitals or evidence of increased search traffic.
- The first CI run flagged the existing root gallery at performance 77 against the unchanged 80-point gate. After its focused hero cleanup, three local gallery runs each scored 88/95/100/100 with CLS 0. The uncropped lead image and presence of all 16 image records (including the lead) were additionally checked at 360, 390, 1440 and 1920 pixels.
- Protected product data, Formspree endpoint, GA ID, Vercel configuration, legal pages and admin page are unchanged.

## Release Boundaries

Do not enable auto-merge. After manual merge, verify the four deployed article URLs, images, CSV response and internal links. Search traffic and rankings must be measured separately using GSC; neither AI imagery nor schema guarantees rankings or FAQ rich results.
