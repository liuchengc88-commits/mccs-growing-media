# GA4 AI Referral Slope Monitor

## Measurement

The public site emits `ai_referral_session` once per browser session when the referrer host matches ChatGPT, Claude, Perplexity, Gemini/Bard, Copilot, Poe or You.com. GA4 continues to record its native `Session source / medium`; the custom event makes AI-referred sessions easier to trend without altering page content.

## GA4 report filter

Use **Reports > Acquisition > Traffic acquisition** and set the primary dimension to **Session source / medium**. Apply an Include filter to **Session source** using this regular expression:

```text
chatgpt|openai|claude|anthropic|perplexity|gemini|bard|copilot|poe|you\.com
```

Add metrics for Sessions, Engaged sessions, Engagement rate and Key events. Use the session-scoped report; do not mix it with First user source metrics.

## Slope, not total volume

Use a 28-day view split into two 14-day windows. Plot daily AI-referral sessions and calculate the least-squares daily slope for each window. Track:

- current 14-day sessions-per-day slope;
- previous 14-day sessions-per-day slope;
- slope change;
- engaged-session rate and verified lead key events as quality checks.

Low volume can make a short slope noisy. Keep zero-session days in the series and avoid claiming growth until the positive direction persists across at least two weekly reviews.

## Custom dimensions

Register these event-scoped custom dimensions in **Admin > Data display > Custom definitions** if source-family breakdown is needed:

- `ai_referrer_family`
- `ai_referrer_host`

The event name itself is available without registering a custom dimension.
