# Piral Changelog

## 1.9.0 (tbd)

- Fixed platform providers for `piral-ng` with Angular 20 in non-standalone form (#764)
- Improved output when installation of packages fails (#759)
- Improved error message when template resolution fails (#763)
- Updated some dependencies such as `axios` (#765)
- Updated `dets` to latest release
- Updated `piral-cli-webpack5` to never output empty `main.css` files in pilets
- Added support for Angular 20 in `piral-ng`

## 1.8.5 (April 15, 2025)

- Fixed generation of declarations during `pilet build` in the `piral-cli`
- Updated versions of Angular used in `piral-ng`
- Added support for Angular 19 in `piral-ng` incl. support for input signals

## 1.8.4 (April 1, 2025)

- Fixed newline when updating JSON files using the `piral-cli` (#749)
- Added `createCoreApi` and `renderElement` as direct exports to `piral-core`

## 1.8.3 (March 19, 2025)

- Fixed `piral-component` to work with React 19
- Fixed `importmap` entry in emulator for async centrally shared dependencies
- Improved pilet scaffolding within a monorepo (#742)
- Updated `breakpoints` to have flexible breakpoints
- Added `breakpoints` parameter to `getAppInstance` options
- Added `breakpoints` parameter to `createInstanceElement` function
- Added `attachStyles` override option to `loaderConfig`

## 1.8.2 (January 31, 2025)

- Fixed issue with command line parsing in the `piral-cli` on Windows

## 1.8.1 (January 27, 2025)

- Fixed build issue in `publish-microfrontend`

## 1.8.0 (January 26, 2025)

- Fixed pinning of dependencies in `piral-configs` (#733)
- Fixed the plugin detection of the `piral-cli` using pnpm (#734)
- Fixed redirect loop in `piral-ng` (#738)
- Fixed issue with most recent version of `open` in the `piral-cli`
- Improved error overlay with source maps and auto-close on reload
- Updated `kras` and `dets` to latest release
- Updated dependencies
- Added support for `wouter` as a `react-router` drop-in replacement
- Added automatic creation of a feed in the `create-piral-instance` initializer survey
- Added configuration option for internal styles (#731)

## 1.7.3 (December 11, 2024)

- Fixed `pilet upgrade` command with `npm` client not changing *package.json*
- Fixed shared dependency list from website emulator to exclude legacy dependencies
- Fixed issue with relative app path in emulator package generated on Windows
- Added `--allow-self-signed` flag to `piral-cli` commands using HTTP requests
- Added support for `react-router` v7

## 1.7.2 (November 8, 2024)

- Fixed removal of `MutationEvent` in recent Chrome in `piral-blazor` (#724) by @dheid
- Fixed inclusion of React components in serialized dev tools message (#726)

## 1.7.1 (November 2, 2024)

- Fixed `engines` field to have a constraint for Node.js >=18.17
- Fixed release mode behavior of `piral-vue3` reactivity (#720)

## 1.7.0 (October 16, 2024)

- Fixed issue in `piral-vue3` concerning reactivity of props (#720)
- Updated to latest version of `dets`
- Updated website emulator to contain scaffolding tarballs
- Updated pilets to automatically treat defined app shells as shared
- Added support for `shared` key in *piral.json*

## 1.6.2 (September 27, 2024)

- Fixed `registerBreadcrumbs` in `piral-breadcrumbs` failing when no matcher was specified
- Updated dependencies
- Removed dependency to `path-to-regexp` package
- Added `loading-pilets` and `loaded-pilets` events

## 1.6.1 (August 7, 2024)

- Improved CLI flag validation and documentation (#705)
- Added `InjectionToken` constants for compatibility with Angular's `inject` to `piral-ng` (#703)

## 1.6.0 (July 8, 2024)

- Fixed event dispatching for providers in `piral-blazor`
- Fixed navigation storm in angular pilets (#672)
- Fixed declaration merging for `moduleResolution` set to `bundler` (#701)
- Removed legacy `require` (CommonJS) output in `piral-core` and related libs
- Improved setup of event listeners in `piral-blazor` (#696)
- Improved fallback signature in `piral-translate`
- Improved streaming update in `piral-update`
- Updated dependencies
- Added `--strict-port` option to the `piral-cli` debug commands (#699)
- Added update capabilities to `piral-blazor` extension boundaries
- Added `piral-error-overlay` to `piral-debug-utils`
- Added `unhandled-error` event fired from the `ErrorBoundary`

## 1.5.6 (May 21, 2024)

- Fixed issue with `piral-cli-webpack5` when modifying the config entry point
- Fixed issue with pre-TypeScript 5 versions with module resolution set to `bundler`
- Fixed handling of max event listeners for `pilet debug`
- Updated to latest version of `dets`
- Added dynamic compiler capability to `piral-ng`

## 1.5.5 (May 10, 2024)

- Fixed `piral-ng/extend-webpack` for MJS files using not fully specified references
- Updated TypeScript to use module resolution set to `bundler`
- Added `piral-ng/standalone` to support pure modern Angular standalone (#690)

## 1.5.4 (April 23, 2024)

- Fixed `pilet build` with `--type standalone` to end up at feed selection
- Improved handling of server restart (#687)
- Updated `piral-cli` to also include the *.krasrc* from the current directory (#691)
- Updated `piral-blazor` to contain support for Piral.Blazor providers
- Added `defineVue3Middleware` function to `piral-vue3` (#689)

## 1.5.3 (April 10, 2024)

- Fixed handling of Zone.js across different Angular versions
- Fixed partial appearance of `NG04002` for production pilets using `piral-ng`
- Fixed lazy loading of `defineNgModule` in `piral-ng/convert` to return a generic component
- Fixed setting of initial values (`hard-refresh` and `load-pilets`) via `debug.defaultSettings`
- Updated the `--feed` option for `pilet debug` to send custom headers
- Updated `piral-breadcrumbs` to be independent of React Router (#681)

## 1.5.2 (March 15, 2024)

- Fixed created website emulator paths when running in Windows
- Fixed website emulator running for `pilet debug` in Windows
- Added tea constitution file to repo

## 1.5.1 (March 11, 2024)

- Fixed Node.js engine constraint in `piral-cli` to "16.0.0"
- Fixed `target`-specific navigation in `piral-blazor`
- Fixed definition of not found page for React Router v6 (#677)
- Updated `kras` to latest `v0.16` release
- Added `--type` flag to `piral publish` command

## 1.5.0 (February 25, 2024)

- Fixed error when importing `once` without context (#664)
- Fixed issue with monorepos using Rush (#667)
- Fixed issue with blocked port in case of full debug reload (#671)
- Fixed `@Inject` with multiple instances in `piral-ng` (#673)
- Fixed standalone pilets depending on `@angular/compiler`
- Removed legacy option in `piral-cli-webpack5` to support IE8
- Removed pilet-related options in debug settings when running `piral debug` (#670)
- Improved internal navigation Blazor pilets using `piral-blazor`
- Updated dependencies
- Updated `kras` to `v0.16` to fix some issues and remove `request`
- Updated `piral publish` command to work exclusively for emulator websites
- Added special entry point to emulator website when accessed online (#654)
- Added feed selection view for remote emulator website (#654)

## 1.4.3 (December 26, 2023)

- Fixed issue with `piral-blazor` using routing in standalone mode
- Fixed issue with `piral-blazor` connecting the Piral events
- Fixed support of `piral-blazor` for .NET 8 Blazor

## 1.4.2 (December 16, 2023)

- Fixed misplaced *index.d.ts* in a scaffolded pilet (#658)
- Fixed issue where `pilet publish` could remove the source folder (#657)
- Updated toggle in debug utilities to always use life cycle (#659)

## 1.4.1 (December 14, 2023)

- Fixed issue with pilet injector for certain apps in monorepos
- Added support for middleware functions in `piral-fetch` (#645)

## 1.4.0 (December 12, 2023)

- Fixed issue when target tarball is part of tarball content in `pilet pack` (#642)
- Fixed issue in `piral-translate` replacing falsy values with empty string (#651)
- Moved `piral-jest-utils` and `piral-ie11polyfills-utils` into a separate repository
- Updated documentation on `piral-ng` (#646)
- Updated dependencies (#641)
- Updated `piral-cli` compatibility with Bun as runtime
- Updated generated code to fully use ES2020
- Updated to latest version of `dets`
- Added support for nested translations in `piral-translate` (#648)
- Added support for Angular 17 in `piral-ng`
- Added possibility to publish emulator as a website (#644)
- Added support for micro frontends based on module federation (#643)
- Added isolation mode option in *piral.json* to opt-in for `piral-component` boundary
- Added option to specify runtime execution path for bundler plugins

## 1.3.3 (November 2, 2023)

- Fixed inlined source maps for CSS files of Angular components
- Fixed import in `piral-core` prevent `piral-cli-vite` to properly build
- Updated direct usage of `tslib` in `piral-base`
- Updated to latest version of `dets`
- Added implementation for the `FallbackComponent` attribute in `piral-blazor`

## 1.3.2 (October 23, 2023)

- Fixed issue with loading order for global Blazor pilets in `piral-blazor`
- Added `once` as a convenience method to `EventEmitter`
- Added `bun` as potential package manager
- Added `bun` as bundler option

## 1.3.1 (October 19, 2023)

- Updated behavior with unresolved inherited dependencies (#633)
- Updated behavior to only update installed dependencies on `pilet upgrade`
- Added check to prevent installing of invalid versions locally (#635)

## 1.3.0 (October 9, 2023)

- Fixed issue with global installation in pnpm (#624)
- Fixed issue with `v.x` notation in semver comparisons
- Fixed inclusion of directory entries in the pilet tarballs (#629)
- Updated `piral-ng/common` to use Angular-version specific package `piral-ng-common`
- Added support for features of v9 of Piral.Blazor in `piral-blazor` (#626)
- Added `piral-content` custom element for rendering arbitrary children in foreign elements
- Added configuration for default behavior of implicitly defined shared dependency version constraints (#625)

## 1.2.0 (August 28, 2023)

- Fixed issue with `loader-utils` version
- Fixed issue with potential URL flickering using `piral-ng`
- Fixed build issue in codegen of `piral-core` on Windows (#619)
- Updated `importmap` with `exclude` key allowing exclusions
- Added support for `dependencySymbols` in `piral-blazor`
- Added option to stop module teardown via `flags` parameter in `piral-ng`
- Added abort `signal` to `piral-fetch` options (#621)

## 1.1.0 (July 25, 2023)

- Fixed retrieval of dep versions not exporting their *package.json*
- Fixed calling custom Webpack config throwing an exception
- Fixed absolute to a relative path for shared dependencies
- Updated dependencies of `piral-cli-webpack5`
- Added support for optionally centrally shared dependencies
- Added possibility to extend notification types to `piral-notifications`
- Added possibility to further extend options w.r.t. menu type in `piral-menu`
- Added lint rule for detecting potential CSS conflicts in pilets (#611)

## 1.0.2 (June 27, 2023)

- Fixed support for `piral-extension` inside shadow DOM
- Fixed issue resulting in duplicated files in packed pilets (#608)
- Fixed issue in the public path of pilets with schema `v1` using `piral-cli-webpack5`

## 1.0.1 (June 16, 2023)

- Fixed the declaration of the `css-loader` with no modules in `piral-ng`
- Removed the outdated `peerDependencies` sections from the packages

## 1.0.0 (June 12, 2023)

- First LTS release
- Removed `piral-native` framework package
- Removed `piral-ssr-utils` utils package
- Removed `piral-systemjs-utils` utils package
- Removed `piral-pwa` plugin package

## 0.15.13 (May 31, 2023)

- Fixed `pilet publish --fresh` with schema defined by the "pilet.json"
- Fixed duplicated rendering with nested extensions in `piral-blazor` (#602)
- Added support for `events` capability in `piral-blazor`

## 0.15.12 (May 19, 2023)

- Fixed the `piral-cli` generating wrong d.ts files for TypeScript 5
- Updated peer dependencies of `piral-ng` supporting Angular 15
- Updated documentation of `piral-ng` with support of Angular 16
- Updated dependencies of `piral-cli-webpack5`
- Updated used version of TypeScript to 5.x

## 0.15.11 (May 15, 2023)

- Fixed `empty-skips-render` attribute in `piral-extension`
- Fixed unnecessary re-renders in `piral-extension`

## 0.15.10 (May 8, 2023)

- Fixed `.krasrc` files in pilets to take precendence over emulator
- Fixed support for `pilets` section in `piral.json` of Piral instance
- Fixed issue with numeric custom fields supplied to `pilet publish`
- Updated documentation of `piral-ng` with support of Angular 15
- Updated `piral-debug-utils` to also work more seamlessly with `piral-base`
- Updated `piral-cli` to have `pilet build` working without any Piral instances
- Added variants of `piral-base` (minimal, Node.js, full)
- Added support for new pilet schema `v3` (default remains at `v2`)

## 0.15.9 (April 11, 2023)

- Fixed transport of `state` in routes with `piral-blazor`
- Fixed issue with `piral-svelte/extend-webpack` helper
- Fixed treatment of npm aliased packages as shared dependencies (#593)
- Fixed Node.js engine constraint in `piral-cli` to "14.18.0"
- Changed `pilet pack` to include specified `files` and the *README.md* if available
- Added convenience module `piral-vue-3/extend-webpack`
- Added warnings when plugins are included in the `importmap` (#591)
- Added options to configure default debug flags for Piral instances (#590)
- Added more properties and attributes to `piral-extension` matching `ExtensionSlot`

## 0.15.8 (March 8, 2023)

- Fixed value of `schemaVersion` in *pilet.json* being ignored (#585)
- Added new plugin `piral-tracker` for always-on components
- Added option to reference assets on different URLs in `pilet debug` (#583)
- Added option to merge existing feed pilet metadata in `pilet debug`
- Added DOM events to reflect the loading mechanism in `piral-blazor`
- Added priority loading in `piral-blazor` for special DLLs

## 0.15.7 (February 10, 2023)

- Fixed inconsistency with `pilet build` using explicit target while `pilet publish` using `main` from *package.json*
- Fixed reference to `piral-cli` in `piral-jest-utils`
- Fixed cleanup of modules destroying singleton platform in `piral-ng` (#579) by @Siphalor
- Added `usePiletApi` hook to `piral-core` for app shells

## 0.15.6 (January 30, 2023)

- Fixed issue in `piral-cli` using the bundler without standard input (#575)
- Fixed issue navigation interop for `piral-blazor` in .NET 7 (#577)
- Added generic standalone CLI utility `publish-microfrontend`

## 0.15.5 (January 23, 2023)

- Fixed issue with exports not being returned in pilets (#570)
- Added support for localization to `piral-blazor`
- Added `--krasrc` flag to `piral debug` and `pilet debug` (#572)

## 0.15.4 (December 21, 2022)

- Fixed issue loading `dotnetjs` in `piral-blazor`
- Added watcher for *package.json* and config files to `piral debug`
- Added watcher for *package.json* and config files to `pilet debug`
- Added `--watch` flag to `piral build` command to `piral-cli`
- Added `--watch` flag to `pilet build` command to `piral-cli`

## 0.15.3 (December 16, 2022)

- Added support for Blazor custom elements in `piral-blazor`
- Added support for Blazor hot reload in `piral-blazor`
- Added support for custom emulator startup scripts
- Added `debugTools` config in *piral.json* to include debug tooling in release builds
- Fixed finding specific package versions using npm 8+ in `piral-cli`
- Fixed issue with `piral-cli-webpack5/extend-config` when adding rules
- Fixed CORS issue loading *boot.config.json* in `piral-blazor` (#568)

## 0.15.2 (December 5, 2022)

- Fixed import of common module in CommonJS build of `piral-ng`
- Fixed issue of Angular components not being disposed (#561)
- Improved loading of satellite dependencies in `piral-blazor`
- Added `piral run-emulator` command to `piral-cli`
- Added support for capabilities to `piral-blazor`

## 0.15.1 (November 25, 2022)

- Fixed update of `piral-extension` web component inside foreign components
- Fixed `piral-ng/common` for AoT builds with `ng-packagr` (#559)
- Fixed scaffolding issue with not found Piral instances
- Improved multi Piral instance debugging for pilets
- Improved documentation
- Added `pilet add-piral-instance` command to `piral-cli` (#543)
- Added `pilet remove-piral-instance` command to `piral-cli` (#543)

## 0.15.0 (November 17, 2022)

- Fixed closing of dialogs to be immediate (#549)
- Updated to React v18 (#501)
- Updated `importmap` with `inherit` key
- Moved templates to dedicated repository (#458)
- Changed `piral-cli` to require at least Node.js v12
- Changed the default bundler to be `piral-cli-webpack5` (#469)
- Changed to ask if a bundler should be installed (#545)
- Changed webpack configs to use `oneOf` for assets (#451)
- Changed the internal state container to `zustand`
- Changed portal boundary to `piral-portal` using `display: contents`
- Changed default extension slot to `piral-slot` using `display: contents`
- Deprecated the usage of `renderInstance` (#465)
- Deprecated the usage of `externals` for `pilets`
- Removed support for IE11 (#467)
- Removed bundlers (except default) from Piral monorepo
- Removed templating support for the emulator scaffolding files
- Added new bundler `piral-cli-parcel2` (#436)
- Added new bundler `piral-cli-rollup` (#435)
- Added new bundler `piral-cli-vite` (#435)
- Added pre-bundled minified versions to each plugin package
- Added new convenience package `piral-hooks-utils`
- Added new npm script running bundler `piral-cli-xbuild` (#470)
- Added `--feed` option to `piral debug` command
- Added `--app-name` option to `piral new` command (#546)
- Added lazy loading to `piral-ng` via `defineNgModule`
- Added `feed` provider for using `piral publish`
- Added support for `importmap` in the app shell
- Added semver possibilities for resolving shared dependencies
- Added automatic determination of npm client (#516)
- Added `minimal-piral` for quickly scaffolding pilets using a minimalistic API
- Added `--config` parameter to `piral-cli-webpack5` (#544)
- Added functionality for extending the existing translations

## 0.14.32 (September 21, 2022)

- Fixed `piral-blazor` calling navigation
- Fixed order of wrapping in `piral-page-layouts`

## 0.14.31 (September 7, 2022)

- Fixed Angular Router handling non-existing base URL navigation (#535)
- Fixed persistent settings to only use known keys (#539)

## 0.14.30 (August 26, 2022)

- Improved default metadata using `piletConfig` from *package.json* in `pilet debug` (#458)
- Fixed loading of Aurelia modules in `piral-aurelia`
- Updated `kras` to `v0.15` and set mock sources for `piral debug` (#532)
- Added ability to clear console in `piral-debug-utils` (#534)
- Added ability to persist settings in `piral-debug-utils` (#533)
- Added support for Angular 14 in `piral-ng`
- Added `NotifyLocationChanged` event when route changes within `piral-blazor`
- Added new optional plugin `piral-million` for Million
- Added `--interactive` login for `pilet publish` and `piral publish` (#517)

## 0.14.29 (July 5, 2022)

- Fixed issue with npm initializer using CLI aliases
- Added support for aliases in the npm initializers

## 0.14.28 (July 1, 2022)

- Improved download for templates falling back to default registry
- Fixed navigation via `NavigationManager` of Blazor in `piral-blazor`
- Added warning when overwriting crucial Webpack sections
- Added support for `order` and `empty` props from `piral-blazor`
- Added CLI aliases for problematic flags (e.g., `--install`)

## 0.14.27 (June 7, 2022)

- Fixed issue with `piral-cli-webpack` and `piral-cli-webpack5` not resolving *.jsx*
- Added `--hmr-port` option in `piral-cli-webpack` to configure HMR port (#523)
- Added `--hmr-port` option in `piral-cli-webpack5` to configure HMR port (#523)

## 0.14.26 (June 5, 2022)

- Updated dependencies
- Improved `piral-blazor` lifecycle w.r.t. lazy loading
- Improved handling of blocked ports
- Added `defineBlazorOptions` to standalone converter

## 0.14.25 (May 22, 2022)

- Fixed issue with `piral-cli-esbuild` referencing files in CSS
- Updated `kras` to `v0.14` and improved dev server config resolution
- Added option to set `headers` in kras injector configuration

## 0.14.24 (May 13, 2022)

- Fixed issue with retrieving type root
- Fixed `exports` field to use `*` notation
- Fixed resolution of `piral-cli` plugins with pnpm (#514)
- Fixed missing `PIRAL_PUBLIC_PATH` when building a Piral instance with `piral-cli-esbuild`
- Added `emptySkipsRender` prop to `ExtensionSlot`
- Added `order` prop to `ExtensionSlot`

## 0.14.23 (May 1, 2022)

- Improved typings for registering extension components
- Fixed issue with tilde version specifier of centrally shared dependencies
- Fixed missing update cycle in `piral-vue3` converter (#440)
- Added update lifecycle to `piral-solid`

## 0.14.22 (April 25, 2022)

- Improved `piral-blazor` codegen module
- Improved dependencies codegen module
- Added update lifecycle to `piral-ng` (#508)
- Added `exports` field to package notations

## 0.14.21 (April 12, 2022)

- Updated dependencies
- Improved `piral-modals` with layout options
- Improved type declarations of plugins
- Added `--target` to `piral debug` and `pilet debug` commands (#482)
- Added support for `--public-url` also in `pilet` commands
- Added types to `piral-cli-webpack/extend-config` and `piral-cli-webpack5/extend-config`
- Added option to define the default `template` for `pilets` in Piral instance

## 0.14.20 (April 1, 2022)

- Updated dependencies
- Fixed issue with `pilet build` of `--type standalone` when using importmap
- Added `CUSTOM_ELEMENTS_SCHEMA` to default/fallback module in `piral-ng`
- Added automatic module cleanup on pilet teardown

## 0.14.19 (March 20, 2022)

- Improved pilet injector to always return an array as metadata response
- Removed dependency to `webpack-inject-plugin` in `piral-cli-webpack5`
- Fixed issue with `getCurrentLayout` not returning default layout in SSR
- Fixed `piral` service in `piral-ng` such that it can also be used with `APP_INITIALIZER`
- Added options `--headers` and `--mode` to `pilet publish`
- Added option `--concurrency` to `pilet build` and `pilet debug`

## 0.14.18 (March 15, 2022)

- Fixed issue with `v1` pilets not loading additional chunks
- Fixed CSS inject being applied to importmap dependencies (#492)

## 0.14.17 (March 13, 2022)

- Fixed usage of multi instances of Blazor components (#490)
- Fixed star export of augmented functions from CommonJS (#489)
- Added `update` lifecycle to `piral-blazor` converter

## 0.14.16 (March 10, 2022)

- Fixed problem if provided pilet metadata is immutable (#486)
- Fixed cloning of `MutationEvent` events inside `piral-blazor`
- Upgraded `jest` dependencies to 26.x

## 0.14.15 (March 5, 2022)

- Fixed issue with `get-dependency-map` of the `piral-debug-utils`
- Added support for v0 and v1 pilets in `get-dependency-map`
- Added support for object flags (e.g., `--vars`) in the initializers

## 0.14.14 (March 3, 2022)

- Fixed issue placing *tsconfig.json* in empty template
- Fixed issue placing *piral-layout.jsx* in empty template
- Fixed page not found message when doing pilet development

## 0.14.13 (February 27, 2022)

- Fixed handling of direct function exports in importmaps
- Fixed usage of feed pilets when they are debugged locally
- Added dependency map capability to debug utils

## 0.14.12 (February 21, 2022)

- Improved handling of `--bundler` when scaffolding
- Improved referenced version of dependencies when scaffolding
- Fixed reference to `optimize-css-assets-webpack-plugin` causing Webpack 5 error using npm v8
- Fixed scaffold installation despite `--no-install` when using npm v8

## 0.14.11 (February 17, 2022)

- Improved detection of framework packages
- Improved hash function for remote importmap references
- Fixed wrongly placed imports
- Fixed handling of async errors when loading pilets (#476)
- Added `pilet` to `ErrorInfoProps` (#477)

## 0.14.10 (February 4, 2022)

- Improved support and documentation for wrappers
- Improved default metadata using `piletConfig` from *package.json* in pilet debug (#462)
- Updated vulnerable dependencies
- Fixed typing of extension slot defaults
- Added new prop `meta` to registered pages
- Added support for *debug-meta.json* when using `pilet debug` (#462)
- Added `piral-page-layouts` plugin

## 0.14.9 (January 21, 2022)

- Improved error output in `piral-cli-webpack5`
- Improved error handling in `parcel-codegen-loader`
- Improved `publicUrl` argument with normalization
- Fixed types section missing in documentation
- Fixed error with externals in `piral-cli-webpack`
- Fixed error with externals in `piral-cli-webpack5`

## 0.14.8 (January 20, 2022)

- Improved performance of internal action calls
- Improved the `piral-extension` web component with properties `params`, `empty` and `name`
- Fixed URL to use with `--open` on `piral debug` to include public path
- Fixed *.piralrc* to consider command line arguments for choosing defaults
- Added ability to specify local paths for `--template` in `pilet new` and `piral new`
- Added convenience module `piral-svelte/extend-webpack`
- Added support for direct instance switching

## 0.14.7 (January 12, 2022)

- Updated `PATH` environment usage for child processes in Windows
- Pass on hooks from args in commands of the `piral-cli`
- Added `registry`, `language`, `host`, `port`, and `openBrowser` to *.piralrc*
- Added `html-loader` to `piral-ng/extend-webpack`

## 0.14.6 (January 5, 2022)

- Improved docs w.r.t. npm initializers
- Fixed potential warning about too many listener
- Fixed version of `react-router` in the peer dependencies of `piral-core` (#441)
- Fixed missing update cycle in `piral-vue` converter (#440)

## 0.14.5 (December 13, 2021)

- Improved `pilet debug` to use actual app externals
- Improved `piral debug` to respect `--public-url` like `piral build`
- Fixed `publicPath` in pilets built with Webpack to be `./` instead of `/`
- Fixed default imports of shared dependencies with `v2` schema (#433)
- Fixed usage of `rules` in `extend-config` of `piral-cli-webpack(5)`
- Fixed usage of custom public path with `piral-ng` (#434)
- Removed `file-loader` from `piral-cli-webpack5`
- Added env variable `PIRAL_PUBLIC_PATH` during `piral build` and `piral debug` (#434)
- Added `publicPath` to state container (in `app`)

## 0.14.4 (December 1, 2021)

- Improved siteless API to support using other frameworks
- Fixed issue with entry point of pilet missing
- Added extensions for each plugin component (e.g., `piral-dashboard` for the `Dashboard` component of `piral-dashbard`)

## 0.14.3 (November 26, 2021)

- Improved `pilet-uses-latest-piral` rule w.r.t. monorepos
- Fixed CI/CD scripts to automatically accept version change
- Fixed issue resolving the context when standalone extensions are rendered
- Added `--type standalone` option for building pilets (#427)
- Added `--type manifest` option for building pilets
- Added support for building or publishing multiple pilets at once
- Added `useGlobalStateContext` hook to `piral-core`

## 0.14.2 (November 22, 2021)

- Improved CI/CD scripts
- Fixed issue with weird terminal input after running `piral-cli`

## 0.14.1 (November 19, 2021)

- Improved types of `piral-lazy`
- Fixed usage of `plugins` in `extend-config` of `piral-cli-webpack(5)` (#422)
- Fixed use of DOM references preventing proper use of SSR
- Fixed error when using import maps in `piral-cli-parcel`
- Fixed usage of import maps dependencies in lazy loaded assets in `piral-cli-esbuild`
- Added `deps` props to components loaded with `piral-lazy`
- Added more options to `piral-oidc` and `piral-oauth2`
- Added `createDeferredStrategy` to `piral-base` for simplifying deferred pilet fetching
- Added support for `extraTypes` field in *package.json* of a Piral instance

## 0.14.0 (November 8, 2021)

- Improved converter plugins to allow more flexible pilet embedded usage
- Improved on the fly updates of pilet stylesheets
- Improved the documentation on `piral-ng` (incl. migration tips)
- Changed library contents to target ES6
- Changed `unstable` preview flag to `alpha`
- Changed `pre` preview flag to `beta`
- Changed the expected format for a bundler `piral-cli` plugin
- Added more MSAL options to setup a client in `piral-adal` (#418)
- Added runtime pilet metadata `basePath`
- Added support for new debug utils (#397)
- Added generic `piral-extension` web component for rendering extensions
- Added option to run Angular without `zone.js` in `piral-ng`
- Added bundler for `esbuild` (#363)
- Added direct support for using the Angular router in `piral-ng` (#396)
- Added convenience module `extend-config` for `piral-cli-webpack` and `piral-cli-webpack5` (#410)
- Added support for AoT in `piral-ng` (#415)

## 0.13.9 (September 23, 2021)

- Fixed an issue w.r.t. the serialization of events in the debug tools

## 0.13.8 (September 10, 2021)

- Fixed circular structure support in debugging utils (#409)
- Fixed pilet templates giving wrong path in Windows when scaffolding
- Fixed support for multi pilet debug commands with wildcards on Windows

## 0.13.7 (September 1, 2021)

- Fixed disabling logging of view state changes (#404)
- Improved documentation CI/CD

## 0.13.6 (August 27, 2021)

- Fixed issue with CSS imports in pilets when using Webpack (#403)
- Improved documentation (#395)
- Improved `piral-debug-utils` with new architecture (#397)

## 0.13.5 (August 17, 2021)

- Fixed explicit declaration via state of `LanguagesPicker` component
- Updated outdated `piral-cli-weback` and `piral-cli-webpack5` dependencies
- Improved `piral-cli-webpack` and `piral-cli-webpack5` loader resolution
- Added `getCurrentLanguage` to pilet API from `piral-translate`

## 0.13.4 (August 2, 2021)

- Fixed issue with pilet scaffolding templates on Windows
- Fixed usage of `process.env.ENV` in `piral-ng`
- Fixed selecting scaffolding templates with version specifier
- Added `experimental` branch for `canary` releases

## 0.13.3 (July 28, 2021)

- Fixed missing support for `favicon-webpack-plugin` in `piral-cli-webpack`
- Fixed conflicting import for `piral-cli-parcel` in `piral-breadcrumbs` (#385)
- Added support for `apiKeys` in `.piralrc` file
- Added support for more flexible entry module resolution to `pilet build`
- Added `dashboardPath` and `piralChildren` as options for `renderInstance`
- Added new optional convert plugin `piral-vue-3` covering Vue@3
- Updated used chunk hash length for Webpack
- Updated `piral-ng` to support all (current) versions of Angular
- Replaced `node-sass` with `sass`
- Renamed `master` branch to `main`

## 0.13.2 (April 27, 2021)

- Fixed potential issue for `piral debug` in Firefox
- Fixed limited request length for publishing pilets (#375)
- Updated the `piral-blazor` to accept precomputed IDs from the C# bridge
- Switched to a plugin based stylesheet linking in `piral-cli-webpack` and `piral-cli-webpack5`

## 0.13.1 (April 13, 2021)

- Fixed closing notifications after modifications in `piral-notifications`
- Fixed closing modal dialogs after modifications in `piral-modals`
- Fixed issue preventing rendering of Mithril in `piral-mithril`
- Implemented handling for navigation in `piral-blazor`
- Updated development dependencies
- Updated `tslib` to v2
- Added optional `dependencies` to pilet metadata
- Added option to generate declarations for pilets

## 0.13.0 (March 24, 2021)

- Fixed HMR in `piral-cli-webpack5` when running `piral debug`
- Fixed issue ignoring `--log-level` in the initializers
- Fixed shared submodule dependencies in `peerDependencies` (#341)
- Fixed lazy loading of stylesheets in pilets using `piral-cli-parcel` (#360)
- Updated `kras` with improved web socket reliability (#364)
- Updated to use React 17 (#312)
- Updated the project CI to use Piral Pipelines with YAML
- Updated `withApi` to use `context` instead of `converters`
- Updated `piral-jest-utils` package for Jest mocking (#186)
- Updated Piral CLI path resolution for Windows (#192)
- Updated frontend libraries to be available in ESM format, too
- Added `piral-update` as a plugin to integrate auto update
- Added `feed` parameter to `pilet debug` (#344)
- Added `userStore` as an option for `piral-oidc` (#345)
- Added `wrappers` to enable central component transformations
- Added `apiFactory` option for overriding API creation in `createInstance`
- Added option `emulator-sources` to the `type` parameter of the `piral build` command

## 0.12.4 (November 24, 2020)

- Updated `dets` to use CLI logging levels
- Extended all `register...` APIs to return disposers (#336)
- Added `piral-cli-webpack5` to support bundling with Webpack 5 (#313)
- Added the `packageOverrides` field to override *package.json* values of pilets (#330)
- Added special tagged comments for additional modifications of the `PiletApi` (#332)
- Added `piral-breadcrumbs` for bringing managing breadcrumbs
- Added templating system for scaffolding Piral instances and pilets
- Added Piral instance templates `@smapiot/piral-template-default` and `@smapiot/piral-template-empty`
- Added pilet templates `@smapiot/pilet-template-default` and `@smapiot/pilet-template-empty`
- Added `survey` option to Piral CLI commands
- Added option for using pilets v1 with `crossorigin` attribute (#335)

## 0.12.3 (October 10, 2020)

- Updated support for Blazor 3.2.1 forward in `piral-blazor` (#224)
- Improved the check on `pilet update` to consider `dependencies` (#327)
- Fixed duplicated error message codes in the Piral CLI
- Fixed `pilet validate` taking wrong `main` field (#329)
- Added improved documentation on loading strategies
- Added `--bundler` flag for switching the bundler (#328)
- Added the `piral publish` command with extensibility

## 0.12.2 (September 28, 2020)

- Extracted `piral-debug-utils` to make the debugging helpers more flexible
- Added the `pilet-stays-small` validator (#323)
- Added `piral-cli-webpack/extend-config` helper module
- Added `--fields` options to the `pilet publish` command
- Added `validators` to the *.piralrc* configuration

## 0.12.1 (September 17, 2020)

- Improved typings for the converter plugins `convert` submodule
- Fixed `addEventListener` usage for `piral-native`
- Fixed vulnerable dependency (GHSA-w7rc-rwvf-8q5r)
- Fixed vulnerable dependency (CVE-2020-7720)
- Added support for bundle script entry (#315)
- Added ability to set and retrieve state when signing in using `piral-oidc` (#318)

## 0.12.0 (September 9, 2020)

- Documentation cleanup
- Allow upload of arbitrary pilet sizes in `pilet publish` (#294)
- Renamed `extendApi` to `plugins` (keeping `extendApi` as deprecated)
- Moved Parcel exclusive flags to `piral-cli-parcel`
- Fixed hidden publishing pilet size limit and improved logging of axios errors (#294)
- Fixed Webpack issue in pilets referencing stylesheets (#304)
- Fixed Webpack issue not using Babel for TypeScript files (#310)
- Added `open` package dependency to ensure no errors when using `--open` CLI flag (#303)
- Added more standard fields such as `description` to the emulator package
- Added `import-map-webpack-plugin` to the `piral-cli-webpack`
- Added more flexibility to the `piral declaration` command (#316)

## 0.11.8 (July 9, 2020)

- Updated documentation layout (#206)
- Fixed root-level update in `piral-riot`, `piral-solid`, and `piral-hyperapp`
- Fixed multi-asset output handling in `debug-pilet` with `piral-cli-webpack` (#258)
- Fixed handling of spaces in `piral-cli` arguments (#259)
- Fixed ignoring scoped pathed externals (#263)
- Added basic support for mounting modules in `piral-ng`
- Added ability to add new menu types in `piral-menu`
- Added options for configuration of the `piletApi` in the `.piralrc`
- Added new optional plugin `piral-cycle` (#232)
- Changed module optimization to default to `false` (#256)
- Changed the default bundler to `piral-cli-webpack`
- Changed pilet injector to return full URL (#270)

## 0.11.7 (June 22, 2020)

- Added new optional plugin `piral-solid` for Solid (#231)
- Added `bundler` to `.piralrc` options (#237)
- Added `piral-cli-webpack` as first-class option (#237)
- Added `piral-configs` for configuration management (#238)
- Added option to publish directly from an NPM registry (#239)
- Added the `unload-pilet` event when `injectPilet` is used (#252)
- Added `loadPilet` option to `piral-base`
- Added option to specify the default bundler on `piral new`
- Added option to specify the default bundler on `pilet new`
- Added a sanity check for multi-pilet debugging (#250)
- Added the ability to pass in multiple sources for `pilet debug`
- Added support for scoped piral-cli plugins (#254)
- Extended the multi-debug capability of `pilet debug` (#250)
- Improved mono repo support for `pilet new` (#248)
- Improved mono repo support for `pilet upgrade` (#247)
- Restructured the repository (#240)

## 0.11.6 (June 6, 2020)

- Updated documentation page (#206)
- Added `once` flag for scaffolding (#225)
- Added `defineDependency` to `piral-lazy` (#226)
- Added `piral-jest-utils` package for Jest mocking (#192)
- Added `piral-native` package for React Native (#222)
- Added multi-debug capability to `pilet debug` (#234)
- Improved API of tiles and menu items
- Fixed potentially non-working Piral CLI scaffold on Windows (#192)
- Fixed the use of `matchMedia` for other platforms (#222)
- Fixed discarded props with multiple `includeProvider` calls (#227)
- Fixed broken source map support in pilet debug (#229)
- Fixed CSR should start with rendering the spinner
- Fixed Parcel bundler not reporting failure properly
- Fixed shared dependency declaration for Git references (#233)
- Fixed debugging of pilets in VS Code Server (#235)

## 0.11.5 (May 24, 2020)

- Fixed bug in pilet debug when touching files with CSS references
- Added tutorial for the migration of existing applications (#180)
- Added `piral-cli-parcel` plugin for Parcel integration (#125)
- Fixed the source map offset in Parcel (#216)
- Added `handleAuthentication` to piral-oidc (#219)
- Added `BaseModalOptions` interface to `piral-modals` (#217)
- Specified `integrity` value in pilet response data model
- Fixed the `publicUrl` of the app shell in monorepo (#220)

## 0.11.4 (May 6, 2020)

- Fixed a bug in `piral-fetch` regarding unset `Content-Type`
- Added testimonials on the homepage (#194)
- Added support for Yarn and Pnpm (#203)
- Added optional `--cacert` flag to `pilet publish` command (#204)
- Fixed `NODE_ENV` mode of the emulator (#207)
- Added `getProfile()` to [piral-oidc](./src/plugins/piral-oidc/README.md) (#210)
- Switched to relative paths for local Piral references
- Added new package `siteless` for painless microfrontends
- Added `reducers` option to `piral-feeds`
- Improved options and typings of `piral-feeds`

## 0.11.3 (April 24, 2020)

- Fixed robustness of the declaration generation
- Improved typings for declaring extensions (using `PiralCustomExtensionSlotMap`) (#197)
- Added generic type for `PiralStoreDataEvent` (#198)
- Fixed Parcel logger verbose mode switch on Windows (#199)
- Documented the use of `regenerator-runtime` (#200)
- Added optional meta data argument for `registerPage` (#201)

## 0.11.2 (April 19, 2020)

- Added new optional plugin `piral-blazor` for Blazor (#112)
- Added tutorial on authentication in Piral (#182)
- Improved scaffolding of files for pilets (#189)
- Added app shell watching for pilet debug in monorepos (#190)
- Fixed verbose logging on Windows (#192)
- Fixed the returned type of the `piral-feeds` HOC (#193)
- Improved the emulator package creation
- Improved responsive layout check and re-set

## 0.11.1 (April 8, 2020)

- Improved naming of the extension slot component `key`
- Improved display error when upload to the feed service failed
- Fixed default version for `piral upgrade` command
- Fixed potential timing issues with closing modals and notifications
- Fixed bug in `pilet debug` with reload
- Fixed missing file copy during pilet scaffolding and upgrade
- Fixed missing files in the emulator package
- Added `piral-oidc` plugin (#177)
- Added `piral-oauth2` plugin (#178)
- Added optional `--no-install` flag to `piral upgrade`
- Added optional `--no-install` flag to `pilet upgrade`

## 0.11.0 (April 1, 2020)

- Documented the Piral CLI spec (#110)
- Added support for import maps via `parcel-plugin-import-maps` (#124)
- Switched to use `parcel-plugin-externals` in the Piral CLI (#126)
- Included video links in the tutorials (#135)
- Changed *package.json* metadata format (#136)
- Documented Pilet package spec (#137)
- Documented Feed Service API spec (#138)
- Added support for script evaluation mode (#144)
- Improved API surface from `piral-base`
- Declared `PiletApi` and `Pilet` in `piral-base`
- Switched to use `piral-base` as declaration root
- Included implied schema for generated pilets (supporting `v:0` and `v:1`)
- Added support for aliases prefixed with `@` (#170)
- Provided third-party Piral CLI plugin for webpack (#171)
- Improved logging and documented all message codes (#172)
- Added missing option for customer fetcher (#176)
- Added new optional plugin `piral-redux` for Redux integration
- Use `dets` for declaration generation of Piral instances
- Updated multiple dependencies
- Added new `piral upgrade` command to patch Piral instances

## 0.10.9 (February 28, 2020)

- Improved declaration generation (#168)
- Added cache options to `piral-adal` (#169)

## 0.10.8 (February 25, 2020)

- Fixed declaration dropping "extends string" in generic argument (#164)
- Fixed generic type sometimes getting dropped in ternary expression (#166)
- Fixed generic type dropping with complicated extends rules (#167)
- Fixed inline type of mapped type being dropped (#163)
- Fixed expansion of function return types (#168)
- Updated introductory documentation with more diagrams
- Improved state container debug output
- Fixed calling disposer in case of feed invalidation
- Added new Piral CLI plugin capability "package patcher" (#160)

## 0.10.7 (February 21, 2020)

- Included `core-js/stable` in Piral polyfills (#162)
- Fixed build in mono repo to properly support IE11 (#162)
- Fixed issue with modification of `has-symbols` package (#160)

## 0.10.6 (February 20, 2020)

- Fixed export of default import in declaration (#158)
- Fixed missing type references in declaration (#159)
- Provide fix for invalid buffer import (#160)
- Added support for conditionals in the generated declaration (#161)

## 0.10.5 (February 15, 2020)

- Fixed `keyof` usage in interfaces and as parameters (#152)
- Fixed that pilets are not watched in mono repos (#153)
- Added support for default exports in custom declarations (#154)
- Fixed missing inclusion of JSX exported modules (#155)
- Added `core-js` to standard opt-out polyfills (#157)
- Fixed state container debugging output for use in IE11 (#157)
- Allow disabling state container debug output

## 0.10.4 (February 11, 2020)

- Fixed declaration with expansion of `keyof` (#150)
- Fixed declaration generation of exported functions and generator functions (#151)
- Improved support for mono repo usage (#143)

## 0.10.3 (February 11, 2020)

- Extended debug helper for Piral Inspector
- Allow capturing props in `fromElm`, `fromMithril`, `fromRiot`, `fromSvelte`, and `fromVue`
- Fixed creation of declaration with mixed `type` and `declare const` (#146)
- Fixed wrongly inferred types from regular expression in declaration (#147)
- Fixed inferred types from array in declaration (#148)
- Improved complicated types resolution in declaration (#149)
- Added direct support for mono repo usage (#143)

## 0.10.2 (February 5, 2020)

- Further improvements for the declaration generation
- Fixed top-level aliases in decl. generation (#141)
- Fixed top-level decl. generation regarding unions and intersections (#140)
- Fixed handling of nested exports in decl. generation (#142)
- Added options for filtering to the `piral-search` plugin

## 0.10.1 (February 4, 2020)

- Fixed declaration generation (#139)
- Fixed pilet debug issues with side bundles

## 0.10.0 (February 2, 2020)

- Introduce compatibility check for the Piral CLI (#94)
- Added new optional plugin `piral-mithril` for Mithril.js (#79)
- Added new optional plugin `piral-aurelia` for Aurelia (#80)
- Added new optional plugin `piral-litel` for LitElement (#85)
- Added new optional plugin `piral-ember` for Ember.js (#96)
- Added new optional plugin `piral-svelte` for Svelte (#97)
- Added new optional plugin `piral-elm` for Elm (#118)
- Added new optional plugin `piral-riot` for Riot.js
- Added new optional plugin `piral-react-15` for React v15
- Added new optional plugin `piral-lazy` for generic lazy loading
- Replaced `react-arbiter` with `piral-base` (#109)
- Changed `--skip-install` (default: `false`) flag to `--install` (default: `true`) for scaffolding
- Changed `--only-core` to `--framework` (supporting `piral-base`)
- Changed `--tag` to be a positional argument (for `pilet upgrade`)
- Allow async `setup` in pilets
- Support for `teardown` function in pilets
- Added `dispatch` and `readState` actions
- Allow async pilet module evaluation
- Integrated `state` and `router` in foreign context
- Introduced additional checks for missing files (#129)
- Changed generation of the Piral instance declaration (#116)

## 0.9.9 (January 29, 2020)

- Fixed declaration generation on Windows
- Fixed bundle splitting for pilets

## 0.9.8 (January 27, 2020)

- Fixed the declaration generation for the app instance name (#130)
- Fixed showing modals from other pilets (#131)

## 0.9.7 (January 25, 2020)

- Improved name of imported module declarations during build
- Fix version of the Piral instance

## 0.9.6 (January 22, 2020)

- Resolve cache directory according to Parcel
- Support globs and deep structure in *package.json* `files`

## 0.9.5 (January 21, 2020)

- Fixed regression in the `pilet debug` command
- Fixed documentation issue
- Optimized usage of Parcel cache
- Support for submodule dependency sharing

## 0.9.4 (January 20, 2020)

- Switched to the new Piral logo (#27)
- Allow disabling the modules patching during build (#121)
- Fixed out of memory problem with large bundles (#121)
- Fixed *kras* injector precedence (#122)
- Export all imported module declarations during build (#127)
- Improved debugging experience for legacy browsers (#128)

## 0.9.3 (December 17, 2019)

- Fixed a bug in `piral-urql` when options are not set
- Introduced a sanity check for debugging pilets (#115)
- Removed potential caching from `pilet debug` (#117)
- Copy the files as specified when creating the dev package
- Added final bundle transformation according to the specified preset (#114)
- Provided ability to set initial custom actions
- Exposed the full Parcel CLI spectrum in the `piral-cli` (#119)

## 0.9.2 (December 11, 2019)

- Fixed not found error when copying files for scaffold (#106)
- Fixed upgrading a pilet using outdated information (#108)
- Fixed a bug when building to a non-project folder
- Support invalidation of a `piral-feeds` connector (#93)

## 0.9.1 (December 6, 2019)

- Fixed source maps for debugging pilet (#103)
- Fixed bundle splitting in pilets (#102)
- Improved documentation w.r.t. sharing data (#104)

## 0.9.0 (December 3, 2019)

- Bundle for emulation (#68)
- Added `piral-pwa` plugin (#26)
- Added `piral-adal` plugin (#81)
- Introduced enhanced support for server-side rendering (#35)
- Added utility library `piral-ssr-utils` (#35)
- Provide ability for develop builds of Piral (#68)
- Generate the declaration dynamically (#89)
- Fixed bug concerning the `store-data` event
- Fixed bug in Piral CLI regarding Pilet scaffolding
- Added new optional plugin `piral-inferno` (#86)
- Added new optional plugin `piral-preact` (#86)
- Added new optional plugin `piral-ngjs` (#87)
- Improved and added better error messages in the Piral CLI (#92)
- Improved the pilet upgrade flows (#92)
- Improved the CI/CD pipelines for the `sample-piral` app
- Rewrote the converter API to support full lifecycles
- Removed `piral-fetch` and `piral-urql` from `piral-ext`
- Changed `showNotification` API to allow components
- Changed the search handler to allow returning components

## 0.8.4 (November 15, 2019)

- Fixed the export in the templates (#91)
- Forward props to the error boundary
- Inserted sanity check before replacing exports

## 0.8.3 (October 28, 2019)

- Fixed bug in Piral CLI regarding plugins
- Improved the documentation
- Improved the Piral CLI validation rules API
- Exported minimal set of types for the `PiletApi`

## 0.8.2 (October 24, 2019)

- Fixed bug in Piral CLI preventing to reference external resources
- Fixed bug in Piral CLI that prevented immediate exit
- Improved the `createPiral` function signature/behavior
- Added `SetRedirect` component for declaring redirects

## 0.8.1 (October 23, 2019)

- Improved default template
- Fixed misidentified React class components (#82)
- Added `piral-axios` plugin

## 0.8.0 (October 21, 2019)

- Use declaration merging instead of generics (#72)
- Automatically clear the parcel cache (#59)
- Support of plugins for extending the Piral CLI (#47)
- Extracted `piral-auth` plugin
- Extracted `piral-containers` plugin
- Extracted `piral-dashboard` plugin
- Extracted `piral-feeds` plugin
- Extracted `piral-forms` plugin
- Extracted `piral-search` plugin
- Extracted `piral-menu` plugin
- Extracted `piral-modals` plugin
- Extracted `piral-notifications` plugin
- Added `validate` command for Piral instances (#69)
- Added `validate` command for pilets (#70)
- Support for extensions in Angular (#54), Hyperapp, Vue
- Upgraded Parcel to avoid NPM warning (#64)
- Added ability to select template (`default` or `empty`) when scaffolding
- Improved the `default` template for scaffolding

## 0.7.0 (September 6, 2019)

- Documented using different paths for scaffolding (#58)
- Yield access to the pilet API (#44)
- Attached the actions on the instance (#38)
- Directly evaluates static pilets (#39)
- Evaluates pilets once they arrive instead of all-at-once (#39)
- Updated dependencies
- Overwrite files on initial pilet scaffolding
- Overwrite unchanged scaffolded files on upgrade
- Split `piral-ext` in several packages (#45)
- Added NPM initializers (`create-piral-instance` and `create-pilet`) (#62)
- Added scaffolding hooks for use with the `piral-cli` (#61)
- Fixed missing shared dependencies when debugging pilets (#60)
- Fixed scaffolding of pilets due to a missing Piral instance (#63)
- Improved flexibility for scaffolding dev dependencies (#66)
- Included `tslib` as a shared dependency (#67)
- Improved pilet scaffolding with local packages (#71)
- Updated documentation with big picture and more tutorials (#41)

## 0.6.3 (August 18, 2019)

- Allow pilet scaffolding from non-NPM sources (#53)
- Improved documentation code generation (#52)
- Draft for new documentation design online
- Support configuration for `piral-ext` extensions (#51)
- Remove output folder first on publish with `--fresh`

## 0.6.2 (August 3, 2019)

- Added `extendSharedDependencies` helper (#48)
- Distinguish between Piral development and contributing (#42)
- Started improving the Piral documentation structure (#41)
- Fixed the CSS bundling in pilets
- Adapt documentation about static Piral instance (#43)
- Make first argument of many register methods optional (#29)
- Include *mocks/backend.js* in new Piral instance
- Scaffold with dependency installation (incl. opt.`skip-install` flag)
- Improved Piral CLI output

## 0.6.1 (July 26, 2019)

- Fixed externals resolution (#33)
- Included custom metadata from pilets (#34)
- Added ability to configure the used `history` (#37)

## 0.6.0 (July 22, 2019)

- Improved the sample
- Added new layout builder API
- Unified Piral extension API
- Support asynchronous language switch
- Enable lazy loading of pilets (#2)
- Introduced explicit local pilet state management
- Added `--fresh` flag to the `pilet-publish` command
- Added new optional plugin `piral-hyperapp`
- Moved `track...` API to optional plugin `piral-tracking`
- Aliases are now also available for shorthand CLI commands
- Refactored and improved `piral install` to be `piral new`
- Fixed indirect use of shared dependencies (#30)
- Added `--detailed-report` and `--log-level` to many commands

## 0.5.2 (June 23, 2019)

- Added new optional plugin `piral-vue`
- Improved API of `piral-ng`
- Added `piral install` command to Piral CLI
- Support local CLI installation over global one
- Added samples to documentation page

## 0.5.1 (June 18, 2019)

- Added new optional plugin `piral-ng`
- Extended APIs for `registerExtension` and `registerModal`
- Improved documentation
- Added more flexibility to `piral build` and `piral debug` commands
- Improved bundling with splitting, module resolution, and URLs

## 0.5.0 (June 13, 2019)

- Added more props to the `Layout`
- Allow setting and extending the user
- Fixed rendering of modals
- Added `public-url` option in Piral CLI
- Fixed `piral-cli` build for scoped shared dependencies
- Added error code and output to Piral CLI
- Added more options to the search provider registration
- Provide immediate argument to search provider

## 0.4.0 (June 11, 2019)

- Introduced `subscriptionUrl`
- Renamed `gateway` to `gatewayUrl`
- Renamed `availableModules` to `availablePilets`
- Renamed `requestModules` to `requestPilets`
- Added possibility to override pilet requesting
- Automatically insert shared dependencies
- Changed and documented meta format for Piral and pilets
- Moved `provideTranslations` to `piral-ext`
- Moved `translate` to `piral-ext`
- Provided ability to extend the global state during setup
- Suffixed foreign APIs with `X`, e.g., `registerTileX`

## 0.3.1 (June 5, 2019)

- Updated dependencies
- Added `debug-pilet` command
- Added setup for trackers
- Added ability to attach a static module into `piral`

## 0.3.0 (May 26, 2019)

- Documentation enhancements
- Added project landing page
- Integration tests for Piral CLI
- Updated homepage
- Included fetch and GraphQL API extensions in `piral-ext`
- Changed `piral` to a framework (`piral-core` remains a library)
- Implemented support for pilet split (#1)
- Added version to documentation page (#16)

## 0.2.0 (April 4, 2019)

- Further tooling improvements
- Introduced for `upgrade-pilet` command
- Renamed `PortalApi` to `PiralApi`
- Renamed `PortalInstance` to `PiralInstance`
- Added `registerSearchProvider` API
- Added `createForm` API
- Implemented `pilet-upgrade` command (#11)
- Renamed the forwarded API to `piral`

## 0.1.3 (February 26, 2019)

- Scaffolding of pilets (#3)

## 0.1.2 (February 25, 2019)

- Finished CI pipeline for packages

## 0.1.1 (February 24, 2019)

- Included `kras` in debug process (#4)
- Improved documentation
- Stub releases for `piral` and `piral-ext`

## 0.1.0 (February 21, 2019)

- Initial pre-alpha release of piral-core
- Unfinished rudimentary piral-cli

## 0.0.1 (February 15, 2019)

- This is a stub release to protect the package names
