(() => {
  const referrerGroups = [
    { family: 'chatgpt', hosts: ['chatgpt.com', 'chat.openai.com'] },
    { family: 'claude', hosts: ['claude.ai'] },
    { family: 'perplexity', hosts: ['perplexity.ai'] },
    { family: 'gemini', hosts: ['gemini.google.com', 'bard.google.com'] },
    { family: 'copilot', hosts: ['copilot.microsoft.com'] },
    { family: 'poe', hosts: ['poe.com'] },
    { family: 'you', hosts: ['you.com'] }
  ];

  if (!document.referrer) return;

  let referrerHost;
  try {
    referrerHost = new URL(document.referrer).hostname.toLowerCase();
  } catch {
    return;
  }

  const match = referrerGroups.find((group) =>
    group.hosts.some((host) => referrerHost === host || referrerHost.endsWith(`.${host}`))
  );
  if (!match) return;

  const sessionKey = 'mccs_ai_referral_session_tracked';
  try {
    if (sessionStorage.getItem(sessionKey) === '1') return;
    sessionStorage.setItem(sessionKey, '1');
  } catch {
    // Tracking still works when session storage is unavailable.
  }

  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'ai_referral_session', {
    ai_referrer_family: match.family,
    ai_referrer_host: referrerHost,
    transport_type: 'beacon'
  });
})();
