# Browser Compatibility

The different Piral libraries (`piral-x`, e.g., `piral-core`) are all distributed using a more recent ECMAScript standard. The used functions and browser capabilities will require some polyfills. The polyfills are not supplied by these libraries.

The exception is the `piral`packages. `piral` understands itself as a framework and comes with everything specified for you. It delivers specific versions of `react`, `react-dom`, `react-router`, etc. and bundles polyfills for all known dependent functionality.

## Compatibility Table

The following browsers are supported by `piral`.

| Browser           | Version | Notes |
|-------------------|---------|-------|
| Internet Explorer | ≥ 11    | -     |
| Edge              | *all*   | -     |
| Chrome            | ≥ 52    | -     |
| Firefox           | ≥ 47    | -     |
| Safari            | ≥ 6.1   | -     |
| Opera             | ≥ 41    | -     |
| Mobile Safari     | ≥ 7.0   | -     |
| Android Browser   | > 4.4   | -     |

All browsers not listed here are not tested and should be considered incompatible.

## Feature Compatibility

The compatibility can be increased further by omitting certain features.

- Pilet splitting (pilets using bundle splitting to produce either multiple JavaScript files or link to contained assets): Pilets should instead be delivered in form of a single JavaScript, where resources are directly linked against URLs from a CDN. (breaks, e.g., IE 10 or earlier)
- Custom elements cannot be polyfilled without some other polyfills, which are highly browser version dependent, e.g., IE 10 will require a massive polyfilling package.
- `fetch` cannot be polyfilled in IE 9 or earlier.
- React itself requires at least IE 9 (already with polyfills at work). Rendering React in older versions of IE is not possible.
