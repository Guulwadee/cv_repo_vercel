# Bilingual Resume/CV Builder (EN + SO) — Next.js 14

Create, edit, and export beautiful bilingual resumes with premium templates and payments (Stripe + EVC+). Deploy-ready to Vercel.

Highlights
- Next.js 14 (App Router, Server Actions)
- i18n UI with next-intl (routes: /en, /so)
- Prisma + PostgreSQL (Neon or Postgres)
- Auth: NextAuth (Credentials + Google), email verification
- 5 templates: Creative, Modern, Classic, Professional, Minimalist
- PDF export with puppeteer-core + @sparticuz/chromium (Vercel)
- Payments: Stripe Checkout (MasterCard) + EVC+ (sandbox)
- Shareable public page (/r/{slug}) + OG image
- Tailwind + shadcn-style components
- Sentry, Upstash Rate-limit, Analytics (Plausible)
- Tests: Vitest unit + Playwright e2e
- CI/CD: GitHub Actions (lint, typecheck, test, build), Vercel previews

## Quick Start (Local)

Prereqs
- Node 18+
- pnpm
- Postgres (Neon recommended) or local Docker
- Stripe (optional for local), SMTP for emails (or console fallback)

Setup
```bash
pnpm i
cp .env.example .env
# set DATABASE_URL and NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL=http://localhost:3000
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
Visit http://localhost:3000 (auto-redirects to /en)

Demo credentials after seed:

Email: demo@example.com
Password: demo1234
Database (Neon on Vercel)
Create a Neon project; copy the postgresql://... URL (ensure sslmode=require).
Set DATABASE_URL in Vercel Project Settings.
Auth
Credentials login requires email verification.
Sign up at /en/auth/signup → verification email is sent via SMTP (EMAIL_SERVER, EMAIL_FROM).
For local without SMTP, email logs to console and you can verify via /en/auth/verify?token=... or using the test endpoint in e2e.
Google OAuth

Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env if needed.
i18n
next-intl with route prefixes /en and /so. UI strings in i18n/en.json and i18n/so.json.
Content fields in DB are stored as JSON with { en, so }.
Templates
5 templates in /templates. Live preview in the editor.
Professional is flagged as premium (requires Pro to export without watermark).
PDF Export
Route: POST /api/export/pdf with JSON: { resumeId, template, mode }.
Uses @sparticuz/chromium + puppeteer-core, Vercel-compatible.
Print CSS in /pdf/print.css.
Free: watermark; Pro: no watermark.
For CI and tests, set DISABLE_PDF=true to return a stub PDF.
Payments
Stripe (MasterCard)

Set env:
STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
STRIPE_PRICE_PRO_MONTH, STRIPE_WEBHOOK_SECRET
Create a price in Stripe and set STRIPE_PRICE_PRO_MONTH.
Checkout: POST /api/payments/stripe/checkout
Webhook: POST /api/webhooks/stripe listens for checkout.session.completed.
EVC+ (Hormuud)

Implemented via EVCPlusProvider with HMAC webhook verification.
Env: EVCPLUS_API_BASE, EVCPLUS_MERCHANT_ID, EVCPLUS_API_KEY, EVCPLUS_WEBHOOK_SECRET, EVCPLUS_CURRENCY
Sandbox: If keys are absent, initiate simulates pending; send a webhook to /api/webhooks/evcplus with:
JSON

{ "referenceId": "evc_...", "status": "succeeded", "amount": 500, "currency": "SOS", "userId": "<userId>" }
Shareable Link
Publish your resume and view at /r/{slug} (visibility controls can be added in the editor; default seed is PRIVATE).
Security
NextAuth sessions, CSRF built-in.
Rate-limiting via Upstash (fallback in-memory).
Hardened headers via middleware (CSP, frame-ancestors, referrer-policy).
Never touch raw card data (Stripe hosted checkout only).
Webhooks verify signatures.
Sentry
Set SENTRY_DSN. Sentry auto-instrumentation is wired via Next.js integration.
Analytics
Optional Plausible: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable script.
Tests
Unit (Vitest): validators, watermark, EVC signature
E2E (Playwright): landing, signup→verify (test endpoint), signin
CI sets DISABLE_PDF=true to skip real PDF in tests.
Run tests

Bash

pnpm test        # unit
pnpm e2e         # e2e (starts dev server)
CI/CD
GitHub Actions workflow at .github/workflows/ci.yml
Runs lint, typecheck, unit tests, build, then e2e
Configure Vercel to build on PR for previews
Vercel Deploy
Push this repo to GitHub.
Import into Vercel.
Set environment variables (see .env.example).
Add Stripe and EVC+ webhooks to Vercel URLs:
Stripe: https://<vercel-domain>/api/webhooks/stripe
EVC+: https://<vercel-domain>/api/webhooks/evcplus
Deploy.
Screenshots (suggested)
Editor with live preview
EN/SO toggle
Template gallery
Stripe checkout
EVC+ modal/instructions
PDF sample (A4)
Notes

The app uses a minimal shadcn-like component set (components/ui) to keep footprint small.
Public share page renders the resume for SEO with OG image endpoint.
Admin page shows users, resumes, and payments (RBAC via role).
Enjoy building!

text


Download as zip
- After creating all files, compress the project folder:
  - macOS/Linux: zip -r cv-bilingual-builder.zip .
  - Windows (PowerShell): Compress-Archive -Path . -DestinationPath cv-bilingual-builder.zip

Run and deploy steps
1) Local
- pnpm i
- cp .env.example .env and fill DATABASE_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL
- pnpm prisma:generate
- pnpm prisma:migrate
- pnpm prisma:seed
- pnpm dev

2) Stripe
- Create a product + monthly price, set STRIPE_PRICE_PRO_MONTH, set webhook secret STRIPE_WEBHOOK_SECRET, enable env keys.

3) EVC+ (Sandbox)
- Without keys, initiate returns pending; simulate webhook via POST to /api/webhooks/evcplus with JSON payload as shown.

4) Vercel
- Push to GitHub, import into Vercel, set env vars, deploy.

If you want me to bundle and provide a single downloadable base64 zip, say “Send zip” and I’ll include it inline as an attachment-friendly payload.
