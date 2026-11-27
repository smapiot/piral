---
title: Custom feed services
description: Build and run your own pilet feed service for production.
---

# Custom feed services

The feed service is Piral's discovery layer: on startup the app shell asks it which pilets to load, and `pilet publish` sends new versions to it. Most teams use the managed [Piral Cloud](https://www.piral.cloud) feed and never build one — but the protocol is deliberately small, so running your own is very doable when you need full control, custom targeting logic, or on-prem hosting. This page walks through a minimal, production-shaped implementation you can grow from.

## The protocol

A feed is just two HTTP endpoints — one the shell reads on startup, one the CLI writes to when publishing. Everything else (storage, targeting, rollback) is your implementation detail.

Two endpoints required:

```
GET  /api/v1/pilets          ← called by the app shell on startup
POST /api/v1/pilets          ← called by `npx pilet publish`
```

## Minimal Node.js implementation

The read endpoint returns the metadata the shell needs for each pilet — name, version, bundle URL, and integrity hash. Because it sees the request, it's also where per-user logic lives: filter by role, tenant, or cohort so different users get different pilet sets. The publish endpoint accepts the packed pilet, stores the bundle on a CDN, and records the new version in a database:

```ts
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/v1/pilets', async (req, res) => {
  const user = await verifyToken(req.headers.authorization);
  const all = await db.getActivePilets();

  const visible = all.filter(p =>
    (!p.requiredRole || user.roles.includes(p.requiredRole)) &&
    (!p.tenantId || p.tenantId === user.tenantId)
  );

  res.json({
    items: visible.map(p => ({
      name: p.name,
      version: p.version,
      link: `${CDN_BASE}/${p.name}@${p.version}/index.js`,
      spec: 'v2',
      integrity: p.integrity,
      dependencies: {},
      config: p.config ?? {},
    })),
  });
});

app.post('/api/v1/pilets', verifyApiKey, upload.single('file'), async (req, res) => {
  const meta = await extractPiletMeta(req.file.buffer);
  await uploadToCDN(`${meta.name}@${meta.version}/index.js`, req.file.buffer);
  await db.upsertPilet({ name: meta.name, version: meta.version });
  res.json({ name: meta.name, version: meta.version });
});

app.listen(9000);
```

## Database schema (PostgreSQL)

```sql
CREATE TABLE pilets (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  version      TEXT NOT NULL,
  integrity    TEXT,
  config       JSONB DEFAULT '{}',
  active       BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, version)
);
```

## Rollback endpoint

```ts
app.patch('/api/admin/pilets/:name/rollback', adminOnly, async (req, res) => {
  const { name } = req.params;
  const { version } = req.body;
  await db.query(
    'UPDATE pilets SET active = (version = $2) WHERE name = $1',
    [name, version]
  );
  res.json({ name, activeVersion: version });
});
```

## CDN storage

The feed only ever returns *URLs* to bundles — it doesn't serve the JavaScript itself. Host the bundles as static, content-addressed files (each at a `name@version` path) so they can be cached forever and never collide. Any HTTPS-capable static host works:

Pilet bundles must be publicly accessible over HTTPS.

| Option | Notes |
|---|---|
| AWS S3 + CloudFront | Production standard. Set `Cache-Control: immutable`. |
| Azure Blob + CDN | Same pattern on Azure. |
| Cloudflare R2 | Zero egress cost. |
| GitHub Releases | Free, adequate for low-traffic internal tools. |

## Feed caching

```
Cache-Control: public, max-age=30, stale-while-revalidate=60
```

30-second TTL means rollbacks propagate within 30–60 seconds. Adjust to taste.
