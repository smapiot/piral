# Piral Changelog

## 0.11.5 (tbd)

* Fixed bug in pilet debug when touching files with CSS references
* Added tutorial for the migration of existing applications (#180)
* Added `piral-cli-parcel` plugin for Parcel integration (#125)
* Fixed the source map offset in Parcel (#216)

## 0.11.4 (May 6, 2020)

* Fixed a bug in `piral-fetch` regarding unset `Content-Type`
* Added testimonials on the homepage (#194)
* Added support for Yarn and Pnpm (#203)
* Added optional `--cacert` flag to `pilet publish` command (#204)
* Fixed `NODE_ENV` mode of the emulator (#207)
* Added `getProfile()` to [piral-oidc](./src/packages/piral-oidc/README.md) (#210)
* Switched to relative paths for local Piral references
* Added new package `siteless` for painless microfrontends
* Added `reducers` option to `piral-feeds`
* Improved options and typings of `piral-feeds`

## 0.11.3 (April 24, 2020)

* Fixed robustness of the declaration generation
* Improved typings for declaring extensions (using `PiralCustomExtensionSlotMap`) (#197)
* Added generic type for `PiralStoreDataEvent` (#198)
* Fixed Parcel logger verbose mode switch on Windows (#199)
* Documented the use of `regenerator-runtime` (#200)
* Added optional meta data argument for `registerPage` (#201)

## 0.11.2 (April 19, 2020)

* Added new optional plugin `piral-blazor` for Blazor (#112)
* Added tutorial on authentication in Piral (#182)
* Improved scaffolding of files for pilets (#189)
* Added app shell watching for pilet debug in monorepos (#190)
* Fixed verbose logging on Windows (#192)
* Fixed the returned type of the `piral-feeds` HOC (#193)
* Improved the emulator package creation
* Improved responsive layout check and re-set

## 0.11.1 (April 8, 2020)

* Improved naming of the extension slot component `key`
* Improved display error when upload to the feed service failed
* Fixed default version for `piral upgrade` command
* Fixed potential timing issues with closing modals and notifications
* Fixed bug in `pilet debug` with reload
* Fixed missing file copy during pilet scaffolding and upgrade
* Fixed missing files in the emulator package
* Added `piral-oidc` plugin (#177)
* Added `piral-oauth2` plugin (#178)
* Added optional `--no-install` flag to `piral upgrade`
* Added optional `--no-install` flag to `pilet upgrade`

## 0.11.0 (April 1, 2020)

* Documented the Piral CLI spec (#110)
* Added support for import maps via `parcel-plugin-import-maps` (#124)
* Switched to use `parcel-plugin-externals` in the Piral CLI (#126)
* Included video links in the tutorials (#135)
* Changed *package.json* metadata format (#136)
* Documented Pilet package spec (#137)
* Documented Feed Service API spec (#138)
* Added support for script evaluation mode (#144)
* Improved API surface from `piral-base`
* Declared `PiletApi` and `Pilet` in `piral-base`
* Switched to use `piral-base` as declaration root
* Included implied schema for generated pilets (supporting `v:0` and `v:1`)
* Added support for aliases prefixed with `@` (#170)
* Provided third-party Piral CLI plugin for webpack (#171)
* Improved logging and documented all message codes (#172)
* Added missing option for customer fetcher (#176)
* Added new optional plugin `piral-redux` for Redux integration
* Use `dets` for declaration generation of Piral instances
* Updated multiple dependencies
* Added new `piral upgrade` command to patch Piral instances

## 0.10.9 (February 28, 2020)

* Improved declaration generation (#168)
* Added cache options to `piral-adal` (#169)

## 0.10.8 (February 25, 2020)

* Fixed declaration dropping "extends string" in generic argument (#164)
* Fixed generic type sometimes getting dropped in ternary expression (#166)
* Fixed generic type dropping with complicated extends rules (#167)
* Fixed inline type of mapped type being dropped (#163)
* Fixed expansion of function return types (#168)
* Updated introductory documentation with more diagrams
* Improved state container debug output
* Fixed calling disposer in case of feed invalidation
* Added new Piral CLI plugin capability "package patcher" (#160)

## 0.10.7 (February 21, 2020)

* Included `core-js/stable` in Piral polyfills (#162)
* Fixed build in mono repo to properly support IE11 (#162)
* Fixed issue with modification of `has-symbols` package (#160)

## 0.10.6 (February 20, 2020)

* Fixed export of default import in declaration (#158)
* Fixed missing type references in declaration (#159)
* Provide fix for invalid buffer import (#160)
* Added support for conditionals in the generated declaration (#161)

## 0.10.5 (February 15, 2020)

* Fixed `keyof` usage in interfaces and as parameters (#152)
* Fixed that pilets are not watched in mono repos (#153)
* Added support for default exports in custom declarations (#154)
* Fixed missing inclusion of JSX exported modules (#155)
* Added `core-js` to standard opt-out polyfills (#157)
* Fixed state container debugging output for use in IE11 (#157)
* Allow disabling state container debug output

## 0.10.4 (February 11, 2020)

* Fixed declaration with expansion of `keyof` (#150)
* Fixed declaration generation of exported functions and generator functions (#151)
* Improved support for mono repo usage (#143)

## 0.10.3 (February 11, 2020)

* Extended debug helper for Piral Inspector
* Allow capturing props in `fromElm`, `fromMithril`, `fromRiot`, `fromSvelte`, and `fromVue`
* Fixed creation of declaration with mixed `type` and `declare const` (#146)
* Fixed wrongly inferred types from regular expression in declaration (#147)
* Fixed inferred types from array in declaration (#148)
* Improved complicated types resolution in declaration (#149)
* Added direct support for mono repo usage (#143)

## 0.10.2 (February 5, 2020)

* Further improvements for the declaration generation
* Fixed top-level aliases in decl. generation (#141)
* Fixed top-level decl. generation regarding unions and intersections (#140)
* Fixed handling of nested exports in decl. generation (#142)
* Added options for filtering to the `piral-search` plugin

## 0.10.1 (February 4, 2020)

* Fixed declaration generation (#139)
* Fixed pilet debug issues with side bundles

## 0.10.0 (February 2, 2020)

* Introduce compatibility check for the Piral CLI (#94)
* Added new optional plugin `piral-mithril` for Mithril.js (#79)
* Added new optional plugin `piral-aurelia` for Aurelia (#80)
* Added new optional plugin `piral-litel` for LitElement (#85)
* Added new optional plugin `piral-ember` for Ember.js (#96)
* Added new optional plugin `piral-svelte` for Svelte (#97)
* Added new optional plugin `piral-elm` for Elm (#118)
* Added new optional plugin `piral-riot` for Riot.js
* Added new optional plugin `piral-react-15` for React v15
* Added new optional plugin `piral-lazy` for generic lazy loading
* Replaced `react-arbiter` with `piral-base` (#109)
* Changed `--skip-install` (default: `false`) flag to `--install` (default: `true`) for scaffolding
* Changed `--only-core` to `--framework` (supporting `piral-base`)
* Changed `--tag` to be a positional argument (for `pilet upgrade`)
* Allow async `setup` in pilets
* Support for `teardown` function in pilets
* Added `dispatch` and `readState` actions
* Allow async pilet module evaluation
* Integrated `state` and `router` in foreign context
* Introduced additional checks for missing files (#129)
* Changed generation of the Piral instance declaration (#116)

## 0.9.9 (January 29, 2020)

* Fixed declaration generation on Windows
* Fixed bundle splitting for pilets

## 0.9.8 (January 27, 2020)

* Fixed the declaration generation for the app instance name (#130)
* Fixed showing modals from other pilets (#131)

## 0.9.7 (January 25, 2020)

* Improved name of imported module declarations during build
* Fix version of the Piral instance

## 0.9.6 (January 22, 2020)

* Resolve cache directory according to Parcel
* Support globs and deep structure in *package.json* `files`

## 0.9.5 (January 21, 2020)

* Fixed regression in the `pilet debug` command
* Fixed documentation issue
* Optimized usage of Parcel cache
* Support for submodule dependency sharing

## 0.9.4 (January 20, 2020)

* Switched to the new Piral logo (#27)
* Allow disabling the modules patching during build (#121)
* Fixed out of memory problem with large bundles (#121)
* Fixed *kras* injector precedence (#122)
* Export all imported module declarations during build (#127)
* Improved debugging experience for legacy browsers (#128)

## 0.9.3 (December 17, 2019)

* Fixed a bug in `piral-urql` when options are not set
* Introduced a sanity check for debugging pilets (#115)
* Removed potential caching from `pilet debug` (#117)
* Copy the files as specified when creating the dev package
* Added final bundle transformation according to the specified preset (#114)
* Provided ability to set initial custom actions
* Exposed the full Parcel CLI spectrum in the `piral-cli` (#119)

## 0.9.2 (December 11, 2019)

* Fixed not found error when copying files for scaffold (#106)
* Fixed upgrading a pilet using outdated information (#108)
* Fixed a bug when building to a non-project folder
* Support invalidation of a `piral-feeds` connector (#93)

## 0.9.1 (December 6, 2019)

* Fixed source maps for debugging pilet (#103)
* Fixed bundle splitting in pilets (#102)
* Improved documentation w.r.t. sharing data (#104)

## 0.9.0 (December 3, 2019)

* Bundle for emulation (#68)
* Added `piral-pwa` plugin (#26)
* Added `piral-adal` plugin (#81)
* Introduced enhanced support for server-side rendering (#35)
* Added utility library `piral-ssr-utils` (#35)
* Provide ability for develop builds of Piral (#68)
* Generate the declaration dynamically (#89)
* Fixed bug concerning the `store-data` event
* Fixed bug in Piral CLI regarding Pilet scaffolding
* Added new optional plugin `piral-inferno` (#ƒ)
* Added new optional plugin `piral-preact` (#86)
* Added new optional plugin `piral-ngjs` (#87)
* Improved and added better error messages in the Piral CLI (#92)
* Improved the pilet upgrade flows (#92)
* Improved the CI/CD pipelines for the `sample-piral` app
* Rewrote the converter API to support full lifecycles
* Removed `piral-fetch` and `piral-urql` from `piral-ext`
* Changed `showNotification` API to allow components
* Changed the search handler to allow returning components

## 0.8.4 (November 15, 2019)

* Fixed the export in the templates (#91)
* Forward props to the error boundary
* Inserted sanity check before replacing exports

## 0.8.3 (October 28, 2019)

* Fixed bug in Piral CLI regarding plugins
* Improved the documentation
* Improved the Piral CLI validation rules API
* Exported minimal set of types for the `PiletApi`

## 0.8.2 (October 24, 2019)

* Fixed bug in Piral CLI preventing to reference external resources
* Fixed bug in Piral CLI that prevented immediate exit
* Improved the `createPiral` function signature / behavior
* Added `SetRedirect` component for declaring redirects

## 0.8.1 (October 23, 2019)

* Improved default template
* Fixed misidentified React class components (#82)
* Added `piral-axios` plugin

## 0.8.0 (October 21, 2019)

* Use declaration merging instead of generics (#72)
* Automatically clear the parcel cache (#59)
* Support of plugins for extending the Piral CLI (#47)
* Extracted `piral-auth` plugin
* Extracted `piral-containers` plugin
* Extracted `piral-dashboard` plugin
* Extracted `piral-feeds` plugin
* Extracted `piral-forms` plugin
* Extracted `piral-search` plugin
* Extracted `piral-menu` plugin
* Extracted `piral-modals` plugin
* Extracted `piral-notifications` plugin
* Added `validate` command for Piral instances (#69)
* Added `validate` command for pilets (#70)
* Support for extensions in Angular (#54), Hyperapp, Vue
* Upgraded Parcel to avoid NPM warning (#64)
* Added ability to select template (`default` or `empty`) when scaffolding
* Improved the `default` template for scaffolding

## 0.7.0 (September 6, 2019)

* Documented using different paths for scaffolding (#58)
* Yield access to the pilet API (#44)
* Attached the actions on the instance (#38)
* Directly evaluates static pilets (#39)
* Evaluates pilets once they arrive instead of all-at-once (#39)
* Updated dependencies
* Overwrite files on initial pilet scaffolding
* Overwrite unchanged scaffolded files on upgrade
* Split `piral-ext` in several packages (#45)
* Added NPM initializers (`create-piral-instance` and `create-pilet`) (#62)
* Added scaffolding hooks for use with the `piral-cli` (#61)
* Fixed missing shared dependencies when debugging pilets (#60)
* Fixed scaffolding of pilets due to a missing Piral instance (#63)
* Improved flexibility for scaffolding dev dependencies (#66)
* Included `tslib` as a shared dependency (#67)
* Improved pilet scaffolding with local packages (#71)
* Updated documentation with big picture and more tutorials (#41)

## 0.6.3 (August 18, 2019)

* Allow pilet scaffolding from non-NPM sources (#53)
* Improved documentation code generation (#52)
* Draft for new documentation design online
* Support configuration for `piral-ext` extensions (#51)
* Remove output folder first on publish with `--fresh`

## 0.6.2 (August 3, 2019)

* Added `extendSharedDependencies` helper (#48)
* Distinguish between Piral development and contributing (#42)
* Started improving the Piral documentation structure (#41)
* Fixed the CSS bundling in pilets
* Adapt documentation about static Piral instance (#43)
* Make first argument of many register methods optional (#29)
* Include *mocks/backend.js* in new Piral instance
* Scaffold with dependency installation (incl. opt.`skip-install` flag)
* Improved Piral CLI output

## 0.6.1 (July 26, 2019)

* Fixed externals resolution (#33)
* Included custom metadata from pilets (#34)
* Added ability to configure the used `history` (#37)

## 0.6.0 (July 22, 2019)

* Improved the sample
* Added new layout builder API
* Unified Piral extension API
* Support asynchronous language switch
* Enable lazy loading of pilets (#2)
* Introduced explicit local pilet state management
* Added `--fresh` flag to the `pilet-publish` command
* Added new optional plugin `piral-hyperapp`
* Moved `track...` API to optional plugin `piral-tracking`
* Aliases are now also available for shorthand CLI commands
* Refactored and improved `piral install` to be `piral new`
* Fixed indirect use of shared dependencies (#30)
* Added `--detailed-report` and `--log-level` to many commands

## 0.5.2 (June 23, 2019)

* Added new optional plugin `piral-vue`
* Improved API of `piral-ng`
* Added `piral install` command to Piral CLI
* Support local CLI installation over global one
* Added samples to documentation page

## 0.5.1 (June 18, 2019)

* Added new optional plugin `piral-ng`
* Extended APIs for `registerExtension` and `registerModal`
* Improved documentation
* Added more flexibility to `piral build` and `piral debug` commands
* Improved bundling with splitting, module resolution, and URLs

## 0.5.0 (June 13, 2019)

* Added more props to the `Layout`
* Allow setting and extending the user
* Fixed rendering of modals
* Added `public-url` option in Piral CLI
* Fixed `piral-cli` build for scoped shared dependencies
* Added error code and output to Piral CLI
* Added more options to the search provider registration
* Provide immediate argument to search provider

## 0.4.0 (June 11, 2019)

* Introduced `subscriptionUrl`
* Renamed `gateway` to `gatewayUrl`
* Renamed `availableModules` to `availablePilets`
* Renamed `requestModules` to `requestPilets`
* Added possibility to override pilet requesting
* Automatically insert shared dependencies
* Changed and documented meta format for Piral and pilets
* Moved `provideTranslations` to `piral-ext`
* Moved `translate` to `piral-ext`
* Provided ability to extend the global state during setup
* Suffixed foreign APIs with `X`, e.g., `registerTileX`

## 0.3.1 (June 5, 2019)

* Updated dependencies
* Added `debug-pilet` command
* Added setup for trackers
* Added ability to attach a static module into `piral`

## 0.3.0 (May 26, 2019)

* Documentation enhancements
* Added project landing page
* Integration tests for Piral CLI
* Updated homepage
* Included fetch and GraphQL API extensions in `piral-ext`
* Changed `piral` to a framework (`piral-core` remains a library)
* Implemented support for pilet split (#1)
* Added version to documentation page (#16)

## 0.2.0 (April 4, 2019)

* Further tooling improvements
* Introduced for `upgrade-pilet` command
* Renamed `PortalApi` to `PiralApi`
* Renamed `PortalInstance` to `PiralInstance`
* Added `registerSearchProvider` API
* Added `createForm` API
* Implemented `pilet-upgrade` command (#11)
* Renamed the forwarded API to `piral`

## 0.1.3 (February 26, 2019)

* Scaffolding of pilets (#3)

## 0.1.2 (February 25, 2019)

* Finished CI pipeline for packages

## 0.1.1 (February 24, 2019)

* Included `kras` in debug process (#4)
* Improved documentation
* Stub releases for `piral` and `piral-ext`

## 0.1.0 (February 21, 2019)

* Initial pre-alpha release of piral-core
* Unfinished rudimentary piral-cli

## 0.0.1 (February 15, 2019)

* This is a stub release to protect the package names
