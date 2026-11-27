---
title: Feed service
description: The discovery layer that makes Piral's runtime composition dynamic.
---

# Feed service

The feed service answers one question: *given this request, which pilets should load?* It is the operational control plane for your micro frontend system.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The feed service applies rules to the pilet catalog and returns a different tailored set of pilets per user.">
  <rect class="d-fill" x="0" y="0" width="760" height="290" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="28" y="78" width="156" height="134" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h d-tc" x="106" y="102" fill="var(--dg-ink)">Pilet catalog</text>
  <rect class="d-fill" x="44" y="114" width="124" height="20" rx="4" fill="var(--dg-frame-2)"/>
  <text class="d-s d-tc" x="106" y="128" fill="var(--dg-ink-soft)">checkout · catalog</text>
  <rect class="d-fill" x="44" y="140" width="124" height="20" rx="4" fill="var(--dg-frame-2)"/>
  <text class="d-s d-tc" x="106" y="154" fill="var(--dg-ink-soft)">admin</text>
  <rect class="d-fill" x="44" y="166" width="124" height="20" rx="4" fill="var(--dg-frame-2)"/>
  <text class="d-s d-tc" x="106" y="180" fill="var(--dg-ink-soft)">beta-promo</text>

  <path class="d-dash" d="M184 145 H226" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M222 138 L236 145 L222 152 Z" fill="var(--dg-ink-soft)"/>

  <rect class="d-stroke-2" x="236" y="98" width="180" height="94" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="326" y="132" fill="var(--dg-brand)">Feed Service</text>
  <text class="d-s d-tc" x="326" y="152" fill="var(--dg-ink-soft)">applies rules:</text>
  <text class="d-s d-tc" x="326" y="170" fill="var(--dg-ink-soft)">role · tenant · cohort</text>

  <path class="d-dash" d="M416 128 H468" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M464 121 L478 128 L464 135 Z" fill="var(--dg-ok)"/>
  <path class="d-dash" d="M416 145 H468 V200 H482" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M478 193 L492 200 L478 207 Z" fill="var(--dg-ok)"/>
  <path class="d-dash" d="M416 162 H440 V58 H482" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M478 51 L492 58 L478 65 Z" fill="var(--dg-ok)"/>

  <rect class="d-stroke" x="492" y="34" width="240" height="48" rx="9" fill="var(--dg-c-bg)" stroke="var(--dg-c)"/>
  <text class="d-l" x="508" y="54" fill="var(--dg-c)">Admin</text>
  <text class="d-s" x="508" y="72" fill="var(--dg-ink-soft)">checkout · catalog · admin</text>

  <rect class="d-stroke" x="492" y="104" width="240" height="48" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l" x="508" y="124" fill="var(--dg-a)">Beta user</text>
  <text class="d-s" x="508" y="142" fill="var(--dg-ink-soft)">checkout · catalog · beta-promo</text>

  <rect class="d-stroke" x="492" y="176" width="240" height="48" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-l" x="508" y="196" fill="var(--dg-ink)">Anonymous</text>
  <text class="d-s" x="508" y="214" fill="var(--dg-ink-soft)">checkout · catalog</text>
</svg>
</div>
<figcaption>One catalog, one feed, three different responses — each user only ever receives (and downloads) the pilets they're allowed to see.</figcaption>
</figure>

## The protocol

The app shell makes one GET request at startup:

```
GET /api/v1/pilets
Authorization: Bearer <user-token>
```

The feed responds with a JSON array:

```json
{
  "items": [
    {
      "name": "pilet-checkout",
      "version": "3.1.0",
      "link": "https://cdn.example.com/checkout@3.1.0/index.js",
      "spec": "v2",
      "integrity": "sha384-oqVuAfXRKap...",
      "dependencies": {},
      "config": {
        "checkoutApiUrl": "https://api.example.com/v2/checkout"
      }
    },
    {
      "name": "pilet-catalog",
      "version": "8.0.1",
      "link": "https://cdn.example.com/catalog@8.0.1/index.js",
      "spec": "v2",
      "integrity": "sha384-...",
      "dependencies": {}
    }
  ]
}
```

### Feed item fields

| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | npm package name |
| `version` | ✅ | semver string |
| `link` | ✅ | URL to the JS bundle |
| `spec` | ✅ | Pilet format: `v0`, `v1`, `v2`, or `mf` |
| `integrity` | Recommended | SRI hash — shell verifies before evaluating |
| `dependencies` | ✅ | Extra dependency URLs (usually `{}`) |
| `config` | Optional | Passed to the pilet as `api.meta.config` |
| `custom` | Optional | Arbitrary metadata |

## Runtime configuration via `config`

The `config` field is underused. It lets you parameterise pilet behaviour from the feed — changing it without redeploying the pilet:

```tsx
// In the pilet
export function setup(api: PiletApi) {
  const { checkoutApiUrl, featureFlags } = api.meta.config;

  api.registerPage('/checkout', () => (
    <CheckoutPage apiUrl={checkoutApiUrl} flags={featureFlags} />
  ));
}
```

Different environments, tenants, or experiment groups can receive different configs. One pilet build, multiple runtime behaviours.

## Hosting options

**Piral Cloud** — the official, managed feed service from the Piral team, and the recommended starting point. It adds a dashboard for managing pilets, canary rollouts, instant rollback, and per-user targeting.

- Learn about it at [piral.cloud](https://www.piral.cloud).
- To get started, the online **community edition** at [feed.piral.cloud](https://feed.piral.cloud) is free of charge — ideal for evaluation and small projects.
- For production, request a demo and a license via [partner.piral.cloud](https://partner.piral.cloud). That gives you the ability to run the feed service **on-premises** for production workloads, and to get **professional support** backing your project.

**Static JSON** — The simplest possible feed: a `.json` file hosted on a static CDN. Useful for demos, integration tests, and simple internal tools. Zero infrastructure, no targeting, no rollback.

```json
{
  "items": [
    {
      "name": "my-pilet",
      "version": "1.0.0",
      "link": "https://cdn.example.com/my-pilet@1.0.0/index.js",
      "spec": "v2",
      "integrity": "",
      "dependencies": {}
    }
  ]
}
```

**Self-hosted** — Implement the protocol yourself. The [sample-pilet-service](https://github.com/smapiot/sample-pilet-service) provides a Node.js reference implementation. See [Custom feed services](/advanced/custom-feed) for a production guide.

## Per-user pilet targeting

Because the feed has the user's auth token, it can return different pilet sets for different users:

```ts
app.get('/api/v1/pilets', async (req, res) => {
  const user = await verifyToken(req.headers.authorization);
  const all = await db.getActivePilets();

  const visible = all.filter(p => {
    if (p.requiredRole && !user.roles.includes(p.requiredRole)) return false;
    if (p.betaOnly && !user.isBetaTester) return false;
    if (p.tenantId && p.tenantId !== user.tenantId) return false;
    return true;
  });

  res.json({ items: toMetadata(visible) });
});
```

Users who shouldn't see an admin pilet never receive it — and never download its code. This is stronger than route-level guards inside a pilet.

## Rollback

To roll back a misbehaving pilet:

1. Update the feed to return the previous version (`version` + `link` fields)
2. Users who reload get the old version
3. The app shell does not need to change or redeploy

With Piral Cloud, this is a single click. With a self-hosted feed, it's a database update. Either way: no CI pipeline, no `git revert`, no on-call emergency.

:::tip Cache the feed response
Cache `GET /api/v1/pilets` at your CDN with a short TTL:

```
Cache-Control: public, max-age=30, stale-while-revalidate=60
```

Most requests are served from cache (fast), but the cache refreshes every 30 seconds. A rollback propagates to all users within 30–60 seconds of the database update.
:::

## Publishing a pilet

`pilet publish` POSTs to the feed's publish endpoint. When you have a browser available, prefer the interactive login — you don't have to handle or paste any secret:

```bash
npx pilet publish --url https://feed.example.com/api/v1/pilets --interactive
```

For CI/CD and other automation, use an API key instead (typically from a secret):

```bash
npx pilet publish --url https://feed.example.com/api/v1/pilets --api-key $FEED_API_KEY
```

The feed unpacks the `.tgz`, extracts the bundle, uploads it to your CDN, and records the new version. The next feed response will include it.
