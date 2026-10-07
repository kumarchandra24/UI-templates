/* URLShield detection engine — feature extraction + weighted rule model.
   Works in the browser (window.URLShield) and in Node (module.exports). */
(function (root) {
  const BRANDS = {
    google: ['google.com', 'google.co.in', 'gmail.com', 'youtube.com'],
    paypal: ['paypal.com'],
    amazon: ['amazon.com', 'amazon.in', 'amazon.co.uk'],
    microsoft: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'],
    apple: ['apple.com', 'icloud.com'],
    facebook: ['facebook.com', 'fb.com'],
    instagram: ['instagram.com'],
    netflix: ['netflix.com'],
    whatsapp: ['whatsapp.com'],
    linkedin: ['linkedin.com'],
    dropbox: ['dropbox.com'],
    github: ['github.com'],
    metamask: ['metamask.io'],
    binance: ['binance.com'],
    coinbase: ['coinbase.com'],
    flipkart: ['flipkart.com'],
    paytm: ['paytm.com'],
    phonepe: ['phonepe.com'],
    hdfc: ['hdfcbank.com'],
    icici: ['icicibank.com'],
    sbi: ['onlinesbi.sbi', 'sbi.co.in'],
    chase: ['chase.com'],
    wellsfargo: ['wellsfargo.com'],
    bankofamerica: ['bankofamerica.com'],
    irs: ['irs.gov'],
    dhl: ['dhl.com'],
    fedex: ['fedex.com'],
    openai: ['openai.com'],
    anthropic: ['anthropic.com', 'claude.ai']
  };
  const TRUSTED_EXTRA = ['wikipedia.org', 'stackoverflow.com', 'bbc.com', 'bbc.co.uk', 'nytimes.com', 'who.int',
    'python.org', 'mozilla.org', 'coursera.org', 'tn.gov.in', 'nic.in', 'gov.in', 'mit.edu', 'harvard.edu', 'nasa.gov'];
  const TRUSTED = new Set([].concat(...Object.values(BRANDS), TRUSTED_EXTRA));
  const KEYWORDS = ['login', 'signin', 'sign-in', 'secure', 'verify', 'verification', 'account', 'update', 'confirm',
    'banking', 'netbanking', 'wallet', 'password', 'suspend', 'suspended', 'unlock', 'locked', 'claim', 'prize', 'winner',
    'free', 'gift', 'refund', 'kyc', 'billing', 'payment', 'authenticate', 'recover', 'security', 'support', 'reward', 'rewards'];
  const RISKY_TLDS = ['xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'click', 'support', 'zip', 'work', 'rest', 'icu', 'buzz', 'cyou', 'monster', 'country', 'loan'];
  const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'cutt.ly', 'rb.gy', 'shorturl.at', 'tiny.cc'];
  const SLD2 = ['co', 'com', 'org', 'net', 'gov', 'ac', 'edu'];

  function parse(input) {
    let raw = String(input || '').trim();
    if (!raw) return null;
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
    const full = hasScheme ? raw : 'https://' + raw;
    let u;
    try { u = new URL(full); } catch (e) { return null; }
    if (!/^https?:$/.test(u.protocol)) return null;
    const host = u.hostname.toLowerCase();
    if (!host || (!host.includes('.') && !/^\[/.test(host))) return null;
    return { raw, hasScheme, full, url: u, host };
  }

  function registrable(host) {
    const p = host.split('.');
    if (p.length <= 2) return host;
    const tld = p[p.length - 1], sld = p[p.length - 2];
    if (tld.length === 2 && SLD2.includes(sld) && p.length >= 3) return p.slice(-3).join('.');
    return p.slice(-2).join('.');
  }

  function deLeet(s) {
    return s.replace(/vv/g, 'w').replace(/rn/g, 'm').replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a');
  }

  function analyze(input) {
    const p = parse(input);
    if (!p) return { valid: false, error: 'Enter a full web address such as https://example.com' };
    const { url, host } = p;
    const reg = registrable(host);
    const labels = host.split('.');
    const tld = labels[labels.length - 1];
    const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
    const https = url.protocol === 'https:';
    const full = p.full;
    const path = (url.pathname + url.search + url.hash).toLowerCase();
    const sub = isIP ? [] : labels.slice(0, labels.length - (reg.split('.').length));
    const hyphens = (host.replace(/xn--/g, '').match(/-/g) || []).length;
    const digits = (host.replace(/\./g, '').match(/\d/g) || []).length;
    const hostLen = host.replace(/\./g, '').length || 1;
    const enc = (full.match(/%[0-9a-f]{2}/gi) || []).length;
    const trusted = TRUSTED.has(reg);
    const flags = [];   // {w, text, level}
    const add = (w, text) => flags.push({ w, text });

    // Brand impersonation (real brand name in host but wrong registrable domain)
    let impersonates = null;
    if (!trusted && !isIP) {
      const hostNorm = deLeet(host.replace(/[-.]/g, ''));
      const hostPlain = host.replace(/[-.]/g, '');
      for (const b of Object.keys(BRANDS)) {
        const official = BRANDS[b].some(d => reg === d);
        if (official) continue;
        if (hostPlain.includes(b)) { impersonates = { brand: b, kind: 'direct' }; break; }
        if (hostNorm.includes(b)) { impersonates = { brand: b, kind: 'lookalike' }; break; }
      }
    }
    if (impersonates && impersonates.kind === 'direct')
      add(40, `Uses the brand name “${impersonates.brand}” but the real domain is ${reg}, not an official ${impersonates.brand} domain`);
    if (impersonates && impersonates.kind === 'lookalike')
      add(45, `Look-alike spelling of “${impersonates.brand}” (character swaps such as 0↔o or 1↔l) on domain ${reg}`);
    if (!trusted && !isIP) {
      const emb = [].concat(...Object.values(BRANDS)).find(d => host.includes(d + '.') || host.includes('.' + d + '-'));
      if (emb) add(30, `Contains the real domain “${emb}” inside a different domain (${reg}) — a classic disguise`);
    }
    if (isIP) add(45, 'Address uses a raw IP instead of a domain name — legitimate sites almost never do this');
    if (url.username || full.split('//')[1].split('/')[0].includes('@')) add(25, 'Contains “@” in the address — the real destination is hidden after it');
    if (!https) add(15, 'Connection is not encrypted (HTTP, not HTTPS)');
    if (host.includes('xn--')) add(55, 'Punycode (xn--) domain — a classic homograph trick that disguises look-alike characters');
    if (!isIP && RISKY_TLDS.includes(tld)) add(18, `Top-level domain “.${tld}” is frequently abused by phishing campaigns`);
    if (SHORTENERS.includes(reg)) add(22, 'Link shortener hides the final destination');
    if (hyphens >= 2) add(14, `Excessive hyphens in domain (${hyphens})`);
    else if (hyphens === 1 && !trusted) add(4, 'Hyphen in domain name');
    if (sub.length >= 3) add(12, `Deep subdomain nesting (${sub.length} levels)`);
    if (!isIP && sub.length >= 1 && !trusted) {
      const subStr = sub.join('.');
      const hit = Object.keys(BRANDS).find(b => subStr.includes(b) || host.replace(/-/g, '').includes(b + '.com'));
      if (hit && !(impersonates)) add(30, `Brand “${hit}” appears in a subdomain of an unrelated domain (${reg})`);
    }
    if (full.length > 90) add(10, `Very long URL (${full.length} characters)`);
    else if (full.length > 60) add(5, `Long URL (${full.length} characters)`);
    const hostKw = KEYWORDS.filter(k => host.includes(k));
    const pathKw = KEYWORDS.filter(k => path.includes(k) && !hostKw.includes(k));
    if (!trusted && hostKw.length) add(Math.min(24, 9 * hostKw.length), `Sensitive keywords in domain: ${hostKw.join(', ')}`);
    if (!trusted && pathKw.length) add(Math.min(12, 5 * pathKw.length), `Sensitive keywords in path: ${pathKw.join(', ')}`);
    if (digits / hostLen > 0.3 && !isIP) add(8, 'High share of digits in the domain name');
    if (enc > 3) add(5, `Many percent-encoded characters (${enc})`);
    if (/\/\/.*\/\//.test(full.slice(8))) add(5, 'Double slash inside the path');
    if (url.port && !['80', '443', ''].includes(url.port)) add(8, `Non-standard port :${url.port}`);
    if (!trusted && !isIP) {
      const pb = Object.keys(BRANDS).find(b => path.includes(b) && !BRANDS[b].some(d => reg === d));
      if (pb && !impersonates) add(15, `Brand name “${pb}” appears in the path or query of an unrelated domain`);
    }
    const redirHint = /[?&](url|redirect|redir|next|goto|return|link|dest|continue)=https?/i.test(full);
    if (redirHint) add(15, 'Query string passes another URL — possible redirect chain');
    if (!hasValidShape(host)) add(10, 'Malformed domain structure');

    let score = flags.reduce((s, f) => s + f.w, 0);
    let good = [];
    if (trusted) {
      score = Math.min(score, 100);
      score = https ? Math.min(score, 6) : Math.min(score, 25);
      good.push(`${reg} is on the trusted-domain allowlist`);
    }
    if (https) good.push('Uses HTTPS encryption');
    if (!flags.length) good.push('No phishing indicators matched');
    score = Math.max(0, Math.min(100, Math.round(score)));
    if (trusted && https && score < 3) score = 3;
    const verdict = score >= 60 ? 'phishing' : score >= 20 ? 'suspicious' : 'safe';
    const hint = redirHint ? 1 : SHORTENERS.includes(reg) ? 1 : 0;
    return {
      valid: true, input: p.raw, url: full, host, domain: reg, tld, subdomains: sub, isIP, https,
      length: full.length, hyphens, dots: (host.match(/\./g) || []).length, digits,
      keywords: hostKw.concat(pathKw), impersonates: impersonates ? impersonates.brand : '',
      trusted, redirectHints: hint, flags: flags.sort((a, b) => b.w - a.w), good, score, verdict,
      confidence: verdict === 'safe' ? Math.min(99, 100 - score) : Math.min(99, Math.max(55, score))
    };
  }
  function hasValidShape(h) { return /^[a-z0-9.\-\[\]:]+$/.test(h) && !h.includes('..') && !h.startsWith('-'); }

  const api = { analyze, parse, registrable, BRANDS, TRUSTED_EXTRA, KEYWORDS, RISKY_TLDS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.URLShield = api;
})(typeof window !== 'undefined' ? window : globalThis);
