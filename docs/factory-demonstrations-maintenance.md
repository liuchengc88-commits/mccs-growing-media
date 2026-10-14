# Factory Demonstrations Maintenance

Update the reviewed localized copy in `data/factory-demonstrations.json`, not the generated articles. Keep source attribution, evidence limitations and filming-date uncertainty intact. Do not infer new CF dimensions or finished-product chemical specifications from factory media.

```powershell
node scripts/sync-factory-demonstrations.mjs
python scripts/optimize-image-markup.py
node scripts/test-factory-demonstrations.cjs
node scripts/test-root-evidence-generators.cjs
node scripts/test-form-protection.cjs
python scripts/audit-site.py
node scripts/audit-json-ld.mjs --strict
```

The existing Chinese and localized-trust generators call the entry synchronizer after regeneration. The synchronizer retains one entry per page and uses each locale's article and quote-form route. Article chrome comes from the existing cutting-observation templates, keeping navigation and consent behavior consistent.

Keep MP4 originals and source branding unchanged. Use explicit measured video dimensions, WebP posters and `preload="none"`; do not add autoplay or load the video files on homepages. The recordings are silent and retain English source overlays; each locale supplies descriptive text alongside the visual demonstration.

When adding or removing article routes, regenerate the sitemap and review the resulting dates. A full sitemap regeneration can refresh historical Git-derived dates unrelated to the change; keep the PR scoped to relevant pages and newly added routes. Run browser checks for mobile width, Arabic RTL, photo zoom, playback and CTA destinations before review.

The 2024 public SGS report ending `301` is a separate source reference from the existing MCCS summaries ending `302`. Do not silently replace either identifier or broaden report applicability without reviewing the corresponding original document.
