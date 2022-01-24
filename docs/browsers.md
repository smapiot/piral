---
title: Browser Compatibility
---

# Browser Compatibility

## Compatibility Table

The following browsers are directly supported by `piral`.

| Browser           | Version | Notes                      |
|-------------------|---------|----------------------------|
| Edge              | *all*   | req. pilet schema v1 or v2 |
| Chrome            | ≥ 52    | -                          |
| Firefox           | ≥ 47    | -                          |
| Safari            | ≥ 6.1   | req. pilet schema v1 or v2 |
| Opera             | ≥ 41    | -                          |
| Mobile Safari     | ≥ 7.0   | req. pilet schema v1 or v2 |

The following browsers are not directly supported by `piral`, but have been working up to some extend in the past:

| Browser           | Version | Notes                      |
|-------------------|---------|----------------------------|
| Internet Explorer | ≥ 11    | requires some polyfills    |
| Android Browser   | > 4.4   | requires some polyfills    |

All browsers not listed above are not tested and should be considered incompatible. The exception is browsers that are based on the Chromium engine, which certainly applies to most browsers today.

::: tip: Pilet schema
The pilet schema indicates the specification that is followed for packaging and delivering a pilet. Right now pilet schema v2 is the default.

The schema is applied at compile-time. So, if you built your pilet using an earlier (pre 0.10) version of Piral then an older schema (v0) was used. A rebuild is necessary to migrate to v1 or v2. The schema can be selected via a command line argument.
:::

## Polyfills

The different Piral libraries (`piral-x`, e.g., `piral-core`) are all distributed using a more recent ECMAScript standard. The used functions and browser capabilities may require some polyfills. The polyfills are not supplied by these libraries.

The exception is the `piral` packages. `piral` understands itself as a framework and comes with everything specified for you. It delivers specific versions of `react`, `react-dom`, `react-router`, etc. and bundles polyfills for all known dependent functionality.

::: tip: Included polyfills
The `piral` package also includes a set of pre-bundled polyfills. You can just import `piral/polyfills` to get all polyfills usually necessary to run your application.

The set of offered polyfills right now includes `regenerator-runtime/runtime` (`async` / `await` state machinery).
:::

## Feature Compatibility

The compatibility can be increased further by omitting certain features.

- Pilet splitting (pilets using bundle splitting to produce either multiple JavaScript files or link to contained assets): Pilets should instead be delivered in form of a single JavaScript, where resources are directly linked against URLs from a CDN.
- Custom elements cannot be polyfilled without some other polyfills, which are highly browser version dependent, e.g., IE 10 will require a massive polyfilling package.
- `fetch` cannot be polyfilled in IE 9 or earlier.
- React itself requires at least IE 9 (already with polyfills at work). Rendering React in older versions of IE is not possible.
