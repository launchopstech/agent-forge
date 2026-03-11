# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it privately:

### 1. **Via GitHub Security Advisories** (Preferred)

Go to: https://github.com/bomatra/agent-forge/security/advisories/new

### 2. **Via Email**

Send details to: **security@agentforge.dev**

---

## What to Include

When reporting a vulnerability, please include:

- **Type of issue** (e.g., SQL injection, XSS, authentication bypass)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability
- **Suggested fix** (if you have one)

---

## Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - **Critical:** Within 7 days
  - **High:** Within 14 days
  - **Medium:** Within 30 days
  - **Low:** Next release cycle

---

## Disclosure Policy

- We will acknowledge receipt of your vulnerability report
- We will send status updates as we investigate
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released (with credit to you, if desired)

---

## Security Best Practices

### For Contributors

When contributing code:

- ✅ Use TypeScript strict mode
- ✅ Validate all user inputs with Zod
- ✅ Sanitize data before rendering (React handles most XSS)
- ✅ Use environment variables for secrets (never commit `.env.local`)
- ✅ Keep dependencies updated (`pnpm update`)
- ✅ Run `pnpm audit` regularly

### For Deployers

When deploying AgentForge:

- ✅ Set `NODE_ENV=production`
- ✅ Use HTTPS only
- ✅ Enable CSP headers (Content Security Policy)
- ✅ Set secure cookie flags (`httpOnly`, `secure`, `sameSite`)
- ✅ Configure rate limiting
- ✅ Enable Vercel's security headers

Example `next.config.mjs`:

```js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## Known Security Considerations

### Environment Variables

- **Never commit** `.env.local` or any file containing secrets
- Use Vercel's environment variable UI for production secrets
- Prefix public vars with `NEXT_PUBLIC_` (exposed to browser)

### Authentication (Phase 6)

- Use established libraries (Clerk, Auth.js) — don't roll your own
- Implement CSRF protection
- Use secure session management
- Enforce strong password policies

### API Routes

- Validate all inputs with Zod
- Implement rate limiting
- Use CORS properly
- Sanitize error messages (don't leak stack traces)

---

## Dependencies

We monitor dependencies for vulnerabilities using:

- **GitHub Dependabot** (automated PR updates)
- **`pnpm audit`** (manual checks)

To check for vulnerabilities:

```bash
pnpm audit
pnpm audit fix
```

---

## Questions?

For security-related questions (not vulnerabilities):

- 💬 [GitHub Discussions](https://github.com/bomatra/agent-forge/discussions)
- 📧 Email: security@agentforge.dev

---

**Thank you for helping keep AgentForge secure!** 🔒
