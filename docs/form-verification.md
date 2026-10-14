# Contact Form Human Verification

## Current Rollout State

The four contact pages now use a native POST to the existing Formspree endpoint.
This supports Formspree's default hosted reCAPTCHA flow without a Cloudflare
account or a public widget key. The blank Turnstile key is intentional in this mode.

On 14 October 2026 the authenticated Formspree settings were inspected:
Formshield and submission archiving were enabled, but CAPTCHA was **Disabled**.
The CAPTCHA settings dialog was inspected and closed without saving changes.
This PR does not claim that server-side verification is already active.

Client validation and the honeypot are supplemental. Only server-side enforcement
protects the public endpoint from direct automated requests.

## Deployment And Cutover

1. Review and manually merge the PR. Do not enable auto-merge.
2. Confirm the production contact pages have the native hosted submission branch.
   Keep email and WhatsApp contact routes available.
3. In the existing Formspree form, choose Settings > CAPTCHA > Adjust settings.
   Enable CAPTCHA, choose the default **reCAPTCHA**, and save.
   Do not choose Custom reCAPTCHA, V3 or Turnstile unless matching keys and a
   coordinated frontend configuration are deliberately supplied.
4. Complete a clearly labeled human test inquiry, including the hosted challenge
   when shown. Check the accepted record in Formspree and the Zoho notification
   separately. A redirect is not proof of accepted delivery.
5. Check that an unverified direct request is challenged or rejected by Formspree.
   Do not report protection as active until both enforcement and delivery pass.
6. If genuine inquiries fail, return CAPTCHA to its prior Disabled state while
   investigating, with the account owner's approval. Do not change the endpoint.

Do not enable the backend before this frontend reaches production: the previous
AJAX handler is not coordinated with a hosted challenge. No paid plan upgrade is
authorized or required for the default hosted flow.

## Local Verification

Run:

```powershell
node scripts/test-form-protection.cjs
node scripts/test-full-site-fixes.cjs
node scripts/test-root-evidence-generators.cjs
node scripts/test-factory-demonstrations.cjs
node scripts/audit-json-ld.mjs --strict
python scripts/audit-site.py
```

Unit tests mock Formspree and do not prove live backend enforcement. They cover
validation, native handoff without resetting buyer fields, optional Turnstile
token lifecycle, and analytics boundaries.

The hosted route emits only `form_submit_attempt`, never `generate_lead`:
a submitted challenge is not an accepted lead. Do not count attempts as
conversions. The optional embedded Turnstile/AJAX route still counts a lead only
after Formspree accepts the response. No contact fields or tokens go to analytics.

A validated CF model query preselects an optional model field without overwriting
the buyer's message. Unknown models are ignored. All 28 approved model IDs are
available in the field.

## Optional Embedded Turnstile

Use only after obtaining the real public site key and configuring the matching
secret directly in Formspree. Keep the secret out of Git and frontend code.
The strict optional check is:

```powershell
node scripts/test-form-protection.cjs --require-turnstile
```

This check intentionally fails for the default hosted mode. It must not be used
as a required hosted-mode CI check.

## Remaining Human Spam

CAPTCHA can reduce automated abuse but cannot prevent a person from submitting
an advertisement. Continue marking unrelated marketing as spam. Do not block
all Gmail addresses, non-English messages or links used by genuine B2B buyers.

## Primary References

- [Formspree reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/)
- [Formspree AJAX guidance](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax)
- [Optional Turnstile integration](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile)
