---
title: Browser Compatibility
---

# Browser Compatibility

Piral works in all recent browsers.

The following browsers are directly supported by `piral`.

| Browser           | Version | Notes                       |
|-------------------|---------|-----------------------------|
| Edge              | *all*   | only pilet schema `v1`/`v2` |
| Chrome            | ≥ 52    | -                           |
| Firefox           | ≥ 47    | -                           |
| Opera             | ≥ 41    | -                           |
| Safari            | ≥ 6.1   | only pilet schema `v1`/`v2` |
| Mobile Safari     | ≥ 7.0   | only pilet schema `v1`/`v2` |

All browsers not listed above are not tested and should be considered incompatible. The exception is browsers that are based on the Chromium engine, which certainly applies to most browsers today.

::: tip: Pilet schema
The pilet schema indicates the specification that is followed for packaging and delivering a pilet. Right now pilet schema `v2` is the default.

The schema is applied at compile-time. So, if you built your pilet using an earlier (pre 0.10) version of Piral then an older schema (v0) was used. A rebuild is necessary to migrate to v1 or v2. The schema can be selected via a command line argument.
:::

The following browsers are not directly supported by Piral, but have been working up to some extend in the past:

| Browser           | Version | Notes                      |
|-------------------|---------|----------------------------|
| Internet Explorer | ≥ 11    | requires some polyfills    |
| Android Browser   | > 4.4   | requires some polyfills    |
