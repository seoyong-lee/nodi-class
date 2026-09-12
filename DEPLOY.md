# Deploy checklist (S1-8)

Step 1 code is ready. The items below need a human (AWS / Amplify / YouTube).

## S1-0 prerequisites
- [ ] SES `mail.<NODI_DOMAIN>` identity + Production access request
- [ ] Route53 hosted zone for `NODI_DOMAIN`
- [ ] Cloudflare Turnstile site keys
- [ ] SSM SecureString: `/nodi/<env>/GATE_SECRET`, `/nodi/<env>/TURNSTILE_SECRET`
- [ ] Real before/after/profile/thumb images (placeholders are in `apps/web/public/img/`)

## CDK (dev)
```bash
pnpm infra:deploy -- -c env=dev -c domain=<NODI_DOMAIN>
# or skip Route53 lookup:
pnpm --filter @nodi/infra exec cdk deploy --all \
  -c env=dev -c domain=<NODI_DOMAIN> -c hostedZoneId=<ZONE_ID>
```

Copy stack outputs into Amplify / `.env.local`:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `GATE_SECRET` (same as SSM)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `BIZ_*` as available

## Amplify Hosting
1. Connect GitHub repo; monorepo `appRoot`: `apps/web` (see root `amplify.yml`)
2. Build: `pnpm install --frozen-lockfile && pnpm --filter @nodi/web build`
3. Custom domain + www redirect
4. Set env vars from `.env.example`

## After prod is live
- [ ] Replace YouTube pinned comment links with `/free/<slug>?src=yt-<slug>`
- [ ] Notion public pages: one-line redirect notice + link
- [ ] Confirm `nodi-events` receives `subscribe.confirmed` within 24h of real traffic
