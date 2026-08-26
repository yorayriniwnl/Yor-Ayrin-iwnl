# Deployment Guide — Yor Portfolio

## Prerequisites

- Node.js >= 20.0.0
- Vercel CLI (optional): `npm i -g vercel`

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
npm run typecheck
```

## Deploy

This repository is the focused one-page portfolio. It has no contact form, API
route, dashboard, webhook, server action, or game runtime. Deploy it directly
with Vercel using `npm run build`.

```bash
vercel --prod
```

After deployment, verify that production serves the current one-page portfolio
instead of an older route tree.

## Post-deploy checklist

- [ ] Visit `/` and confirm the current hero and four case studies are present.
- [ ] Visit `/sitemap.xml` and `/robots.txt`.
- [ ] Open `/resume.pdf`.
- [ ] Test every live project and source link.
- [ ] Run Lighthouse and review performance and accessibility.
- [ ] Verify HTTPS redirect and security headers.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Old routes appear in production | An older deployment is still serving | Connect the current portfolio repository and redeploy its production branch |
| Fonts do not load | CSP blocks Google Fonts | Confirm `style-src` and `font-src` include the Google Fonts hosts |
| Resume link fails | Asset was not included in the deployment | Confirm `public/resume.pdf` exists before building |
