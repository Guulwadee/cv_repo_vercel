# DEPLOYMENT_GUIDE - Vercel

Files added/updated:
- vercel.json (build config for Vercel)
- .env.example (placeholders and instructions)
- DEPLOYMENT_GUIDE.md (this file)

Quick deploy steps:
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, import the repository and create a project.
3. In Project → Settings → Environment Variables, add the keys from .env.example and their real values.
4. Trigger a deployment (push or rerun).

Checklist I verified:
- package.json exists: ✅
- next.config.mjs exists: ✅
- app/ router present: ✅
- prisma/ present: ✅

Notes:
- I did NOT modify application source code other than adding these deployment/configuration files.
- After you set environment variables in Vercel, the build should succeed. If it fails, provide the build log and I'll help troubleshoot.
