---
title: Creating your first pilet
description: Scaffold, develop, build, and publish a pilet.
---

# Creating your first pilet

A pilet is a single feature module — built, deployed, and loaded into the shell independently. This guide takes one from scaffold to published version. The thing that makes the loop pleasant is the **emulator**: it gives you the real app shell locally, so you can develop and test a pilet with hot reload and accurate types, without running any platform infrastructure.

## Scaffold

```bash
npm init pilet@latest -- --source my-portal --target my-feature-pilet --bundler webpack5
cd my-feature-pilet
```

`--source` is the app shell's package name (or a path to its emulator `.tgz` while you develop locally). The initializer installs the emulator and `piral-cli` for you.

## Write the pilet

A pilet has exactly one required entry: an exported `setup` function. The shell calls it once when the pilet loads, handing over the typed Pilet API — and everything the pilet contributes (pages, menu items, extensions) is registered from there. Import `PiletApi` from the shell package so the API is typed to *your* shell:

`src/index.tsx`:

```tsx
import * as React from 'react';
import type { PiletApi } from 'my-portal';

const FeaturePage: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1>My Feature</h1>
    <p>Registered at runtime by a pilet.</p>
  </div>
);

export function setup(api: PiletApi) {
  api.registerPage('/my-feature', FeaturePage);
  api.registerMenu(() => <a href="/my-feature">My Feature</a>);
}
```

## Develop locally

```bash
npm start
# http://localhost:1234/my-feature
```

With hot reload. No platform access needed — the emulator provides the full shell.

## Build and publish

Publishing locally? Use `--interactive` to log in through your browser — there's no API key to create, store, or paste into the terminal:

```bash
npx pilet build
npx pilet validate
npx pilet publish --url https://feed.example.com/api/v1/pilets --interactive
```

In CI/CD (no browser), authenticate with an API key from a secret instead — see the pipeline below.

## CI pipeline

```yaml
name: Publish pilet
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
      - run: npx pilet publish
          --url ${{ vars.FEED_URL }}
          --api-key ${{ secrets.FEED_API_KEY }}
```
