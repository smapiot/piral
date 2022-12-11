---
title: Pilet Lifecycle
description: The lifecycle of a pilet.
section: Internals
---

# Pilet Lifecycle

A pilet is a Node.js library/package that exports at least one function `setup` taking a pilet API to couple components to a Piral instance hosting it.

A pilet's lifecycle exists in two different categories:

- Offline lifecycle, i.e., everything regarding development, maintenance, and provisioning of a pilet
- Online lifecycle, i.e., everything to load and evaluate a pilet inside an app shell

## Offline Lifecycle

The offline lifecycle consists of

1. Initialization / Scaffolding
2. Development & Testing
3. Publishing
4. Maintenance
5. Updates
6. Deprecation
7. Disabling

While (1), (2), and (4) are purely local phases, (3), (5), (6), and (7) will involve the feed service. A feed service should support all of these actions. Usually, in (3) a progressive rollout can be done, too, which would involve starting only with a subset of users until the pilet reaches the desired maturity level.

## Online Lifecycle

The online lifecycle describes what happens when a pilet should be integrated into an app shell. We have:

1. Loading
2. Evaluating
3. Setting up
4. Rendering
5. Tearing down

Herein, phase (1) involves making a request to feed service and retrieving the script. In phase (2) the script is evaluated. This involves running the statically imported modules, e.g., if your code reads something like

```js
// index.tsx
import a from './a';
import b from './b';

export function setup() {
  const d = import('./d');
}

// a.tsx
import c from './c';

export default c;

// b.tsx
export default {};

// c.tsx
import emojisList from 'emojis-list';

export default emojisList[26];
```

Then modules `index.tsx`, `a.tsx`, `b.tsx`, `c.tsx`, and `emojis-list` will be evaluated, but `d.tsx` not - as it is dynamically imported.

In phase (3) the required `setup` function will be run. In the rendering phase (4) all the registered components from phase (3) are then appearing in the application when demanded.

In phase (5) the optional `teardown` function will be run.
