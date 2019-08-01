# Piral Changelog

## 0.6.2 (to be determined)

* Added `extendSharedDependencies` helper (#48)
* Distinguish between Piral development and contributing (#42)
* Started improving the Piral documentation structure (#41)
* Adapt documentation about static Piral instance (#43)
* Make first argument of many register methods optional (#29)

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
* Added new optional library `piral-hyperapp`
* Moved `track...` API to optional library `piral-tracking`
* Aliases are now also available for shorthand CLI commands
* Refactored and improved `piral install` to be `piral new`
* Fixed indirect use of shared dependencies (#30)
* Added `--detailed-report` and `--log-level` to many commands

## 0.5.2 (June 23, 2019)

* Added new optional library `piral-vue`
* Improved API of `piral-ng`
* Added `piral install` command to Piral CLI
* Support local CLI installation over global one
* Added samples to documentation page

## 0.5.1 (June 18, 2019)

* Added new optional library `piral-ng`
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
