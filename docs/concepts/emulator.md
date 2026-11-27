---
title: Emulator
description: How the emulator solves local pilet development without running the full platform.
---

# Emulator

The emulator is Piral's answer to the hardest practical problem in micro frontend development: **how do you work on your piece of the UI without running the entire platform?**

<figure>
<div class="diagram-wrap">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The app shell build emits an emulator package; a pilet installs it and develops against the real shell with hot reload">
  <rect class="d-fill" x="0" y="0" width="760" height="300" rx="14" fill="var(--dg-canvas)"/>

  <rect class="d-stroke" x="34" y="64" width="186" height="120" rx="10" fill="var(--dg-brand-bg)" stroke="var(--dg-brand)"/>
  <text class="d-h d-tc" x="127" y="92" fill="var(--dg-brand)">App Shell</text>
  <text class="d-s d-tc" x="127" y="110" fill="var(--dg-ink-soft)">the host application</text>
  <rect class="d-fill" x="50" y="128" width="154" height="22" rx="5" fill="var(--dg-frame)"/>
  <text class="d-m d-tc" x="127" y="143" fill="var(--dg-ink-soft)">npx piral build</text>
  <text class="d-s d-tc" x="127" y="170" fill="var(--dg-ink-soft)">emits two artifacts</text>

  <path class="d-dash" d="M220 124 H290" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M286 117 L300 124 L286 131 Z" fill="var(--dg-ink-soft)"/>

  <rect class="d-stroke" x="300" y="74" width="160" height="100" rx="10" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <text class="d-h d-tc" x="380" y="100" fill="var(--dg-ink)">Emulator</text>
  <text class="d-m d-tc" x="380" y="120" fill="var(--dg-ink-soft)">my-shell-1.0.tgz</text>
  <text class="d-s d-tc" x="380" y="142" fill="var(--dg-ink-soft)">debug shell + HMR</text>
  <text class="d-s d-tc" x="380" y="158" fill="var(--dg-ink-soft)">+ PiletApi types</text>

  <path class="d-dash" d="M460 124 H530" stroke="var(--dg-ink-soft)"/>
  <path class="d-fill" d="M526 117 L540 124 L526 131 Z" fill="var(--dg-ink-soft)"/>
  <text class="d-s d-tc" x="495" y="112" fill="var(--dg-ink-soft)">install</text>

  <rect class="d-stroke" x="540" y="40" width="186" height="184" rx="10" fill="var(--dg-a-bg)" stroke="var(--dg-a)"/>
  <text class="d-h d-tc" x="633" y="64" fill="var(--dg-a)">Your Pilet</text>
  <rect class="d-thin" x="556" y="76" width="154" height="100" rx="7" fill="var(--dg-frame)" stroke="var(--dg-line)"/>
  <path class="d-thin" d="M556 96 H710" stroke="var(--dg-line)"/>
  <circle class="d-fill" cx="566" cy="86" r="2.4" fill="var(--dg-brand)"/>
  <text class="d-s" x="576" y="90" fill="var(--dg-ink-soft)">real app shell</text>
  <rect class="d-fill" x="568" y="108" width="130" height="56" rx="6" fill="var(--dg-a-bg)"/>
  <text class="d-s d-tc" x="633" y="140" fill="var(--dg-a)">your pilet page</text>
  <rect class="d-fill" x="556" y="188" width="154" height="22" rx="5" fill="var(--dg-frame)"/>
  <text class="d-m d-tc" x="633" y="203" fill="var(--dg-ink-soft)">npm start · hot reload</text>
</svg>
</div>
<figcaption>The emulator lets a pilet run inside the real shell locally — no platform access required.</figcaption>
</figure>

## The problem

In any micro frontend system, a pilet needs to run inside the real app shell to behave correctly. The shell provides the layout your component lives inside, the navigation it links into, the shared dependencies it imports from, and the extension slots it might fill.

Developing against a stub or blank page means integration issues surface late, in staging or production. Running the full platform locally requires infrastructure access that's often impractical — especially for contractors, new joiners, or developers on constrained hardware.

## What the emulator contains

When you build the app shell, the CLI produces two outputs:

```
dist/
├── release/            ← deploy to production
└── emulator/
    └── my-app-shell-1.0.0.tgz   ← share with pilet developers
```

The emulator `.tgz` contains:

- A **debug build of the app shell** with source maps, no minification, HMR support
- **TypeScript type definitions** for `PiletApi` — scoped to the installed plugins
- The shell's **`importmap` declarations** so the pilet knows what's centrally shared
- Metadata about the shell version and supported pilet spec

## Using the emulator

```bash
# The emulator is installed as a dev dependency when you scaffold the pilet.
# To add or update it manually:
npm install --save-dev my-app-shell

# Start local pilet development
npm start
# or explicitly (the target shell is read from package.json):
npx pilet debug
```

`pilet debug`:

1. Reads the emulator from `node_modules/my-app-shell`
2. Starts a local web server rendering the full app shell
3. Injects the current pilet bundle via an in-memory API stub
4. Watches for file changes and hot-reloads in-place

The developer sees their pilet running inside the actual shell — real layout, real navigation, real shared dependencies, real extension slots — without any network access to a live environment.

:::tip Load live pilets alongside your local one
```bash
npx pilet debug --feed https://feed.example.com/api/v1/pilets
```
This loads pilets from the feed alongside your local pilet — useful for testing extension slot interactions.
:::

## Distributing the emulator

There are two ways to get the emulator to pilet developers, and neither one ties you to the public npm registry.

**As a package.** The emulator `.tgz` is an ordinary npm package, so you publish it wherever your team already hosts packages — a private/company registry (Azure Artifacts, GitHub Packages, Verdaccio, Nexus, Artifactory) or even a purely local registry. The public npmjs.org registry is just one option, not a requirement. Point each pilet at the right registry the same way you would for any scoped dependency (an `.npmrc` entry), and `npm init pilet`'s `--source` can read from it.

```bash
npx piral publish --type emulator --registry https://npm.my-company.com
```

**As an emulator website.** If you'd rather not deal with a registry at all, build the emulator as a hosted website and have pilets debug against its URL:

```bash
npx piral build --type emulator-website
# deploy dist/emulator-website/ to any static host, then in the pilet:
npx pilet debug --app https://emulator.my-portal.example.com
```

The pilet downloads the debug shell from that URL instead of `node_modules`. This is handy for teams without a private registry, for onboarding (nothing to install but the pilet itself), and for keeping every pilet on a single, centrally updated shell.

:::tip Which to choose
The package approach gives each pilet a pinned, offline-capable shell version and the best TypeScript story. The website approach removes registry setup entirely and guarantees everyone debugs against the same deployed shell. Many teams use both — a website for quick onboarding, packages for pinned CI builds.
:::

## Emulator in CI

Pilet build pipelines use the emulator to validate against real shell types:

```yaml
- run: npm ci                 # installs emulator from package-lock
- run: npx tsc --noEmit       # type-checks against real PiletApi types
- run: npx pilet build        # confirms the bundle builds cleanly
- run: npx pilet validate     # validates pilet format and metadata
```

A type error here means the pilet is calling an API that doesn't exist in the target shell version — caught before it ever reaches a user.

## Version coordination

When the app shell adds a new plugin or changes the API, it bumps its version and publishes a new emulator. Pilet teams upgrade their dev dependency:

```bash
npx pilet upgrade          # upgrade to latest emulator
npx pilet upgrade 2.0.0    # pin to a specific version
```

Pilets that haven't upgraded continue working — old API methods remain present. New methods only appear in TypeScript once the pilet upgrades. This is how backward compatibility is maintained across dozens of independently developed pilets.

## Differences from production

| Aspect | Emulator | Production |
|--------|----------|------------|
| Minification | No | Yes |
| Source maps | Yes | Optional |
| Hot reload | Yes | No |
| Pilet served from | `localhost` API stub | CDN URL |
| Error display | DevTools overlay | Error boundary |
| Other pilets | Optional via `--feed` | All from feed response |

These differences exist to make development fast. None affect the pilet's runtime behavior when deployed.
