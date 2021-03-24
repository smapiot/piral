# Browser Compatibility

## Compatibility Table

The following browsers are supported by `piral`.

| Browser           | Version | Notes                |
|-------------------|---------|----------------------|
| Internet Explorer | ≥ 11    | requires polyfills   |
| Edge              | *all*   | req. pilet schema v1 |
| Chrome            | ≥ 52    | -                    |
| Firefox           | ≥ 47    | -                    |
| Safari            | ≥ 6.1   | req. pilet schema v1 |
| Opera             | ≥ 41    | -                    |
| Mobile Safari     | ≥ 7.0   | req. pilet schema v1 |
| Android Browser   | > 4.4   | requires polyfills   |

All browsers not listed here are not tested and should be considered incompatible except browsers that are based on the Chromium (or Blink) engine.

::: tip: Pilet schema
The pilet schema v1 is the default. Nothing needs to be done for compatibility here.

If you are built your pilet using an earlier (pre 0.10) version of Piral then v0 was used. A rebuild may be necessary.
:::

## Polyfills

The different Piral libraries (`piral-x`, e.g., `piral-core`) are all distributed using a more recent ECMAScript standard. The used functions and browser capabilities will require some polyfills. The polyfills are not supplied by these libraries.

The exception is the `piral` packages. `piral` understands itself as a framework and comes with everything specified for you. It delivers specific versions of `react`, `react-dom`, `react-router`, etc. and bundles polyfills for all known dependent functionality.

Framework polyfills:

- Promise API
- URL API
- fetch API
- `document.currentScript`

::: tip: Included polyfills
The `piral` package also includes a set of pre-bundled polyfills. You can just import `piral/polyfills` to get all polyfills usually necessary to run your application.

The set of offered polyfills also included `core-js/stable` (standard JS API polyfills) and `regenerator-runtime/runtime` (`async` / `await` state machinery).
:::

## Feature Compatibility

The compatibility can be increased further by omitting certain features.

- Pilet splitting (pilets using bundle splitting to produce either multiple JavaScript files or link to contained assets): Pilets should instead be delivered in form of a single JavaScript, where resources are directly linked against URLs from a CDN. (breaks, e.g., IE 10 or earlier)
- Custom elements cannot be polyfilled without some other polyfills, which are highly browser version dependent, e.g., IE 10 will require a massive polyfilling package.
- `fetch` cannot be polyfilled in IE 9 or earlier.
- React itself requires at least IE 9 (already with polyfills at work). Rendering React in older versions of IE is not possible.
