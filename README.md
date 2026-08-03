# MCCS Growing Media Multilingual Website

Deployable static website package for GitHub + Vercel.

## Included languages
- English: `/`
- Spanish: `/es/`
- Arabic: `/ar/`

## This update includes
- Contact form placeholders added: Your Name, Work Email, Company Name, WhatsApp / Phone.
- Application field split into Orchid and Tissue Culture.
- Preferred shipping method remains optional to reduce first-inquiry friction.
- Homepage headline copy, trust bar and water-saving claims strengthened according to the optimization checklist.
- Sample & Shipping SEO title changed to include Sample & Export Shipping.
- Private Label H1 strengthened with MCCS Factory Direct.
- About page company description reframed around production capability.
- Product galleries now include model-specific packaging reference images.
- Insight article dates staggered to create a more natural editorial cadence.
- Sitemap regenerated with all multilingual pages.

## Deployment
Upload all extracted files to the GitHub repository root and commit. Vercel will redeploy automatically.

## SEO maintenance

- Regenerate `sitemap.xml` after adding, removing or renaming buyer pages: `node scripts/generate-sitemap.mjs`.
- The generator excludes utility, legal and `noindex` redirect pages and uses each page's latest Git commit date for `lastmod`.


## Background integration update
- Added page-specific greenhouse, propagation, shipping, private-label, about, insights and contact background images under `/assets/backgrounds/`.
- Added responsive CSS overlays and mobile layout adjustments.
- Product data and product specifications were not changed in this update.


## Mobile UX checklist update
- Added hamburger navigation for mobile.
- Converted product comparison table into mobile card view.
- Improved cookie banner height/close behavior and WhatsApp spacing.
- Increased language-switch touch targets to 44x44px.
- Reordered contact form on mobile so first fields appear earlier.
- Improved product filters, CTA hierarchy, and mobile spacing.


## 2026-06-06 Header update
- Header brand changed to `MCCS Plug`.
- Header CTA shortened to `Request Sample` / localized equivalents.
- Desktop navigation spacing refined.
- Mobile header spacing and touch targets refined.


## 2026-06 header logo update

- Replaced the header letter icon with a seedling logo mark.
- Refined MCCS Plug brand spacing and desktop/mobile navigation alignment.
- Added SVG favicon at `assets/favicon.svg`.
