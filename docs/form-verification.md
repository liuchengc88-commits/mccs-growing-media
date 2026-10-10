# Contact Form Human Verification

## Current Rollout State

The shared contact-form script supports Cloudflare Turnstile on `/contact/`,
`/cn/contact/`, `/es/contact/` and `/ar/contact/`. The public site key is currently
blank, so this change does **not** activate CAPTCHA yet. Keep the PR as a draft
until a real key, Formspree configuration and end-to-end checks are ready.

Client validation and the honeypot remain supplemental. Only Formspree's
server-side CAPTCHA enforcement protects the public endpoint from direct POSTs.

## Account Configuration

1. Sign in to Cloudflare and create a **Managed** Turnstile widget for
   `mccsgrowingmedia.com` and `www.mccsgrowingmedia.com`. Do not move the site's DNS
   or enable pre-clearance; neither is needed for this contact form.
2. Put the **public site key only** into `turnstileSiteKey` in
   `assets/form-protection.js`. The four languages share this one setting.
3. Keep the secret key outside Git, chat, browser screenshots and frontend code.
   The account owner enters it directly into the existing Formspree form's
   Settings > CAPTCHA > Adjust settings > Cloudflare Turnstile.
4. Do not save/enable a different server-side CAPTCHA until the matching frontend
   is deployed. A mismatched provider/key can reject genuine buyer inquiries.
   Coordinate the short cutover window, verify immediately, and keep email and
   WhatsApp contact routes available.
5. If Formspree offers a domain restriction on the current plan, review its scope
   and allow the production domain without changing the form endpoint. Origin
   restrictions alone are not a replacement for server token validation.

The endpoint, notification address, GA identifier, products and Vercel settings
must remain unchanged. No paid account upgrade is required by this code; do not
purchase an upgrade without explicit approval.

## Verification Before Merge And Activation

Run from the repository root:

```powershell
node scripts/test-form-protection.cjs
node scripts/test-form-protection.cjs --require-turnstile
node scripts/audit-json-ld.mjs --strict
python scripts/audit-site.py
```

The `--require-turnstile` check deliberately fails with a blank or known Cloudflare
testing key. Unit tests mock verification and Formspree; passing them is not proof
of server-side enforcement or live delivery.

- Use Cloudflare's official testing keys only in a disposable local preview;
  never ship one as the production site key and never send test tokens to the
  production form.
- Check mobile width at 320, 360 and 390 pixels, desktop layout, and Arabic RTL.
  Narrow forms use the compact widget; wider forms use the flexible widget.
  Resizing across that boundary recreates the widget without clearing buyer fields.
- Check missing, expired, failed and blocked-script verification, retry without
  losing buyer inputs, and a new token after every attempted POST.
- Confirm no token or personal field is sent to analytics. `generate_lead` fires
  only after a successful Formspree response.
- After deployment, have the owner complete a clearly labeled real test inquiry
  and verify it in Formspree/Zoho. Confirm a request without a valid token is
  rejected by Formspree, not merely by the browser. Do not claim activation before
  these two checks pass.

## Remaining Marketing Spam

CAPTCHA reduces automated abuse; it does not prevent a real person from sending
an advertisement. Keep marking unrelated marketing submissions as spam in
Formspree and review its server-side filtering/rules if needed. Do not block all
Gmail addresses, non-English text or links, which legitimate B2B buyers may use.

## Primary References

- [Formspree Turnstile integration](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile)
- [Cloudflare client integration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare single-use token validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
