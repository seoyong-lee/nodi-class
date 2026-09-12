# Deploy checklist

Step 1 code is ready. The items below need a human (AWS / Amplify / YouTube).

## Prerequisites
- [ ] SES `mail.<NODI_DOMAIN>` identity + Production access request
- [ ] Route53 hosted zone for `NODI_DOMAIN`
- [ ] Cloudflare Turnstile site keys
- [ ] SSM SecureString: `/nodi-class/GATE_SECRET`, `/nodi-class/TURNSTILE_SECRET`, `/nodi-class/ADMIN_API_KEY`
- [ ] Real before/after/profile/thumb images (placeholders are in `apps/web/public/img/`)

## CDK (single stack `nodi-class`)
```bash
pnpm infra:deploy -- -c domain=<NODI_DOMAIN>
# or skip Route53 lookup:
pnpm --filter @nodi/infra exec cdk deploy \
  -c domain=<NODI_DOMAIN> -c hostedZoneId=<ZONE_ID>
# custom API domain api.<domain>:
pnpm --filter @nodi/infra exec cdk deploy \
  -c domain=<NODI_DOMAIN> -c hostedZoneId=<ZONE_ID> -c enableCustomDomain=true
```

Copy stack outputs into Amplify / `.env.local`:
- `ApiUrl` → `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL=https://<NODI_DOMAIN>`
- `GATE_SECRET` (same as SSM)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `BIZ_*` as available

## Seed free resources (MDX → DynamoDB)
```bash
API_URL=<ApiUrl> ADMIN_API_KEY=<ssm value> pnpm seed:resources
```

## Amplify Hosting
1. Connect GitHub repo; monorepo `appRoot`: `apps/web` (see root `amplify.yml`)
2. Build: `pnpm install --frozen-lockfile && pnpm --filter @nodi/web build`
3. Custom domain + www redirect
4. Set env vars from `.env.example`

## After live
- [ ] Replace YouTube pinned comment links with `/free/<slug>?src=yt-<slug>`
- [ ] Notion public pages: one-line redirect notice + link
- [ ] Confirm `nodi-class-events` receives `subscribe.confirmed` within 24h of real traffic
