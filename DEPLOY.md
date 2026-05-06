# Deployment Guide — Yor Portfolio

## Prerequisites

- Node.js >= 20.0.0
- Vercel CLI (optional): `npm i -g vercel`

## Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL e.g. `https://yorayriniwnl.vercel.app` |
| `GITHUB_TOKEN` | Yes | GitHub personal access token (public repo access) |
| `GITHUB_WEBHOOK_SECRET` | Yes | Secret for verifying GitHub webhook payloads |
| `EMAIL_HOST` | Yes | SMTP host for Nodemailer (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | Yes | SMTP port (usually `465` or `587`) |
| `EMAIL_USER` | Yes | SMTP username / sender email |
| `EMAIL_PASS` | Yes | SMTP password or app password |
| `EMAIL_TO` | Yes | Recipient email for contact form messages |
| `ADMIN_KEY` | No | Secret key for `/dashboard?admin=1` access |
| `PITCH_PASSWORD` | No | Password for `/pitch` practice mode |
| `SEND_CONFIRMATION` | No | Set to `'true'` to send confirmation emails to senders |
| `ANTHROPIC_API_KEY` | No | Anthropic API key for AI chat features |

## Local Development

```bash
cp .env.local.example .env.local
# Fill in the variables above
npm install
npm run dev
```

## First Deploy

```bash
vercel --prod
```

## Subsequent Deploys

Push to the `main` branch — Vercel auto-deploys on every push.

## Post-Deploy Checklist

- [ ] Visit `/sitemap.xml` — verify all routes are listed
- [ ] Visit `/robots.txt` — verify content is correct
- [ ] Test contact form — send a message, verify email received
- [ ] Test `/dashboard` — verify page loads without errors
- [ ] Run Lighthouse — target Performance > 90, Accessibility > 95
- [ ] Check OG image: paste URL into https://opengraph.xyz
- [ ] Verify HTTPS redirect works (HTTP → HTTPS)
- [ ] Check security headers: https://securityheaders.com

## GitHub Webhook Setup

Used for auto-updating project data when repositories change.

1. Go to your GitHub profile → **Settings → Webhooks**
2. Click **Add webhook**
3. Payload URL: `https://yorayriniwnl.vercel.app/api/github-webhook`
4. Content type: `application/json`
5. Secret: same value as `GITHUB_WEBHOOK_SECRET` env var
6. Events: select **Push events** only
7. Click **Add webhook**

## Static Export (Optional)

To build a fully static export (e.g. for GitHub Pages):

```bash
STATIC_EXPORT=true npm run build
# Output is in the /out directory
```

Note: API routes and server-side features are not available in static export mode, and this mode should not be used on Vercel.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails with Three.js import error | Missing transpile config | Verify `transpilePackages: ['three']` in `next.config.js` |
| Contact form not sending | Bad SMTP config | Verify all `EMAIL_*` env vars, check spam folder |
| GitHub data not updating | Token scope | Ensure `GITHUB_TOKEN` has `public_repo` scope |
| 3D scenes not loading | CSP blocks Web Workers | Confirm `worker-src 'self' blob:` is present in CSP header |
| Fonts not loading | CSP blocks Google Fonts | Confirm `font-src` includes `https://fonts.gstatic.com` |
| `NEXT_PUBLIC_*` vars missing at runtime | Not prefixed correctly | All client-side vars must start with `NEXT_PUBLIC_` |
