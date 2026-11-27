---
title: piral-base
description: The framework-agnostic pilet loading runtime.
---

# piral-base

`piral-base` is the lowest-level package in the Piral stack. It handles pilet loading, evaluation, and lifecycle management with no dependency on React or any UI framework.

Use `piral-base` directly only when building a completely custom runtime on a non-React stack. For most apps, use `piral-core` (React) or `piral` (React + standard plugins).

## Installation

```bash
npm install piral-base
```

## `createPilet(metadata, options)`

Load and evaluate a single pilet:

```ts
import { createPilet } from 'piral-base';

const pilet = await createPilet(piletMetadata, {
  getDependencies() {
    return { react: React, 'react-dom': ReactDOM };
  },
});
```

## `loadPilets(options)`

Load multiple pilets from a feed:

```ts
import { loadPilets } from 'piral-base';

const pilets = await loadPilets({
  fetchPilets() {
    return fetch('/api/v1/pilets').then(r => r.json()).then(r => r.items);
  },
  getDependencies() {
    return { react: React };
  },
});
```

## Pilet spec versions

| Spec | Description |
|---|---|
| `v0` | Legacy UMD format |
| `v1` | Named exports |
| `v2` | Current default — supports code splitting |
| `mf` | Module Federation-based |

Specify when building: `npx pilet build --schema v2`
