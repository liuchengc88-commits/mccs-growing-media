## What changed

- Ran the scheduled competitor audit.
- Generated the latest competitor audit reports under `reports/competitor-audit/`.
- Applied only conservative optimizer changes when the optimizer found safe opportunities.

## Why

The audit prioritizes English main-site conversion and SEO first, keeps product/insights/internal-link recommendations separate, and moves multilingual fine-tuning into a lower-priority review lane. Admin pages and invalid competitor URLs are ignored.

## Safety checks

- No direct push to `main`; this change is submitted as a Pull Request.
- Product data files are excluded from optimizer edits.
- Product parameters, model names, dimensions, MOQ and carton quantity data are not edited by the scripts.
- Formspree endpoints, Google Analytics ID and Vercel configuration are protected.

## High Priority: English Main-Site Conversion and SEO

- No high-priority recommendations.

## Medium Priority: Product Pages, Insights and Internal Links

- /cn/ - CTA: Add a clear sample, quote or contact CTA near buyer decision sections.
- /cn/ - Meta description: Use a 120-165 character buyer-focused description with material, application and inquiry intent.
- /cn/ - SEO title: Review title length and make the primary buyer keyword clearer.
- /cn/ - Trust: Strengthen proof points such as factory-direct supply, testing documents, production capability or export support.
- /cn/about/ - CTA: Add a clear sample, quote or contact CTA near buyer decision sections.
- /cn/about/ - Meta description: Use a 120-165 character buyer-focused description with material, application and inquiry intent.
- /cn/about/ - SEO title: Review title length and make the primary buyer keyword clearer.
- /cn/about/ - Trust: Strengthen proof points such as factory-direct supply, testing documents, production capability or export support.
- /cn/applications/automated-transplanter-grow-plugs/ - CTA: Add a clear sample, quote or contact CTA near buyer decision sections.
- /cn/applications/automated-transplanter-grow-plugs/ - Meta description: Use a 120-165 character buyer-focused description with material, application and inquiry intent.

Review the generated report before merging.
