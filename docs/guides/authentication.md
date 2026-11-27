---
title: Authentication
description: Two ways to authenticate a Piral app — cookie-based via a BFF (recommended) and token-based — plus feed-level access control.
---

# Authentication

Authentication in Piral comes down to one question: **how does a request prove who the user is?** There are two broad answers, and the choice shapes how much the app shell and pilets have to do.

- **Cookie-based (via a BFF)** — a backend holds the session and the browser carries an HttpOnly cookie automatically. *Recommended for most apps.*
- **Token-based** — the app shell obtains an access token and attaches it to each request.

A useful rule of thumb: if you control the backend the frontend talks to, prefer the cookie/BFF approach. Reach for tokens when you must call APIs the BFF can't sit in front of.

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Token-based auth keeps a token in the browser and attaches it to requests; cookie/BFF keeps the session server-side and the browser carries an HttpOnly cookie automatically.">
  <rect class="d-fill" x="0" y="0" width="760" height="300" rx="14" fill="var(--dg-canvas)"/>
  <text class="d-h" x="36" y="34" fill="var(--dg-ink)">Token-based</text>
  <rect class="d-stroke" x="36" y="46" width="200" height="64" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="136" y="72" fill="var(--dg-a)">Browser</text>
  <text class="d-s d-tc" x="136" y="90" fill="var(--dg-ink-soft)">shell + pilet · holds token</text>
  <path class="d-dash" d="M236 78 H520" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M517 72 L528 78 L517 84 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="382" y="70" fill="var(--dg-ink-soft)">Authorization: Bearer …</text>
  <rect class="d-stroke" x="528" y="46" width="196" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-l d-tc" x="626" y="82" fill="var(--dg-ink)">Protected APIs</text>
  <text class="d-s" x="36" y="130" fill="var(--dg-ink-soft)">token is reachable from JS (XSS risk) · you manage refresh</text>
  <text class="d-h" x="36" y="176" fill="var(--dg-brand)">Cookie-based · BFF (recommended)</text>
  <rect class="d-stroke" x="36" y="188" width="180" height="64" rx="9" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-l d-tc" x="126" y="214" fill="var(--dg-a)">Browser</text>
  <text class="d-s d-tc" x="126" y="232" fill="var(--dg-ink-soft)">no token in JS</text>
  <path class="d-dash" d="M216 220 H296" stroke="var(--dg-ok)"/>
  <path class="d-fill" d="M293 214 L304 220 L293 226 Z" fill="var(--dg-ok)"/>
  <text class="d-s d-tc" x="256" y="210" fill="var(--dg-ink-soft)">cookie</text>
  <rect class="d-stroke-2" x="304" y="188" width="170" height="64" rx="9" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-l d-tc" x="389" y="214" fill="var(--dg-brand)">BFF</text>
  <text class="d-s d-tc" x="389" y="232" fill="var(--dg-ink-soft)">session + HttpOnly cookie</text>
  <path class="d-dash" d="M474 220 H520" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M517 214 L528 220 L517 226 Z" fill="var(--dg-ink-soft)"/>
  <rect class="d-stroke" x="528" y="188" width="196" height="64" rx="9" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-l d-tc" x="626" y="224" fill="var(--dg-ink)">Backend services</text>
  <text class="d-s" x="36" y="272" fill="var(--dg-ink-soft)">cookie is sent automatically · HttpOnly means no XSS exposure</text>
</svg>
</div>
<figcaption>Token-based auth keeps a token in the browser and attaches it to every request; with a cookie/BFF the session lives server-side and the browser carries it automatically.</figcaption>
</figure>

## Cookie-based authentication with a BFF (recommended)

A **Backend-For-Frontend (BFF)** is a small server that sits between the browser and your backend services. The user authenticates against the BFF, which keeps the session server-side and sets a secure, **HttpOnly cookie**. From then on the browser attaches that cookie to every request automatically — so neither the app shell nor any pilet has to manage tokens at all.

```tsx
import { createInstance, Piral } from 'piral';
import * as React from 'react';
import { render } from 'react-dom';

const instance = createInstance({
  // The feed lives behind the BFF (same site). The cookie is sent automatically;
  // no Authorization header to build.
  async requestPilets() {
    const res = await fetch('/bff/api/v1/pilets', { credentials: 'include' });
    return (await res.json()).items;
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
```

Inside a pilet, calls to your backend simply work — the cookie rides along:

```tsx
export function setup(api: PiletApi) {
  api.registerPage('/orders', () => {
    // same-origin (or BFF-proxied) request — the session cookie is sent for you
    const load = () => fetch('/bff/orders', { credentials: 'include' }).then((r) => r.json());
    return <OrdersPage load={load} />;
  });
}
```

Why this is the default recommendation:

- **More secure.** The token never lives in JavaScript or storage, so it can't be stolen via XSS. HttpOnly + Secure + SameSite cookies are handled by the browser.
- **More reliable.** No token refresh logic in the frontend, no expiry races; the BFF manages the session lifecycle.
- **Easier.** The app shell does essentially no auth work, and every pilet's `fetch` just works without a plugin or shared token.

The trade-off is **flexibility**: every backend call has to be reachable through the BFF (directly or proxied). For the large majority of line-of-business portals that's perfectly fine — and well worth the security and simplicity it buys.

:::tip
With a BFF you usually don't need an auth plugin at all. Plugins like `piral-oidc` exist to bring *tokens* to the Pilet API — if your requests are authenticated by a cookie, there's no token for pilets to consume.
:::

## Token-based authentication

When a BFF isn't an option — for example pilets must call third-party or cross-origin APIs directly — the app shell obtains an **access token** (often via OpenID Connect) and attaches it to requests as an `Authorization` header.

```tsx
async function bootstrap() {
  const token = await getAccessToken(); // your OIDC/OAuth mechanism
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const instance = createInstance({
    async requestPilets() {
      const res = await fetch(FEED_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return (await res.json()).items;
    },
  });

  render(<Piral instance={instance} />, document.querySelector('#app'));
}

bootstrap();
```

### Letting pilets use the token

Pilets shouldn't each re-implement auth. Expose the token (and an authenticated fetch) through a small plugin in the app shell — this is exactly what an auth plugin is for:

```ts
import { createPiralPlugin } from 'piral-core';

export function createAuthApi() {
  return createPiralPlugin(() => () => ({
    getAccessToken: () => getAccessToken(),
    async fetchAuthenticated(url: string, init?: RequestInit) {
      const token = await getAccessToken();
      return fetch(url, {
        ...init,
        headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
      });
    },
  }));
}
```

### Using an official plugin: `piral-oidc`

Rather than wiring OIDC by hand, the [`piral-oidc`](/reference/plugins) plugin surfaces tokens and sign-in/out to pilets through the API:

```tsx
import { createOidcApi, OidcClient } from 'piral-oidc';

const client = OidcClient.create({
  clientId: 'my-app',
  identityProviderUri: 'https://auth.example.com',
  redirectUri: `${window.location.origin}/callback`,
  scopes: ['openid', 'profile'],
});

const instance = createInstance({
  plugins: [createOidcApi(client)],
  async requestPilets() {
    const token = await client.getAccessToken();
    return fetch(FEED_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((r) => r.items);
  },
});
```

Be aware of the costs token-based auth brings: the token is reachable from JavaScript (an XSS risk), you must handle refresh and expiry, and every pilet that calls a protected API needs the token. These are the very problems the cookie/BFF approach avoids.

## Feed-level access control

Independent of how requests are authenticated, the feed service can return **different pilets for different users** — the strongest form of access control, because users never even download code they aren't allowed to run:

```ts
const visible = all.filter((p) =>
  !p.requiredRole || user.roles.includes(p.requiredRole),
);
```

See [Feed service → per-user targeting](/concepts/feed-service#per-user-pilet-targeting).

## Pilet route guards

For in-app gating, a pilet can guard its own routes — useful for hiding UI, though it is not a substitute for server-side checks:

```tsx
const AdminPage = () => {
  if (!api.isAuthenticated?.()) return <Navigate to="/login" replace />;
  return <AdminDashboard />;
};

api.registerPage('/admin', AdminPage);
```
