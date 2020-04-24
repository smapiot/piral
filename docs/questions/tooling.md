# Tooling

## Why custom tooling?

We provide custom tooling to give developers the highest possible convenience. No custom tooling is required for any task, e.g., building or deploying a pilet.

Our custom tooling is only a thin layer on established tools (e.g., Parcel) to already use the right settings for maximum efficiency. We documented what is needed to establish the same with standard tooling, e.g., bundling using Webpack.

We strongly believe that our tooling should hit the sweep spot for almost everyone. Anyone who is not in this group still has our full support. Our ultimate goal is to provide a layer that just works and can be adopted to almost every development workflow instead of requiring development workflows to change.

---------------------------------------

## Why is testing not part of the CLI?

We've debated a lot if (unit or end-to-end) testing are good targets for the CLI to be covered. In the end we've decided to leave this to the development team of a particular Piral instance.

While the Piral CLI is certainly opinionated we tried to make it not overly restrictive. There are many testing frameworks and configurations out there and all of them have some direct influence on how development is done. We cannot cover all these flows without making compromises and imposing restrictions on the developers. Thus we decided to leave testing out - by default.

You can install `piral-cli` plugins that make testing very easy and (optionally) part of the validation process.

---------------------------------------

## Is the CLI cross-platform?

Since the CLI uses Node.js it seems so. Nevertheless, there is always the chance that some dependency or included code has a bug on some platform. If you hit such a bug please report it immediately.

---------------------------------------

## What's the motivation for pilet publish?

By specification a Pilet is published to a standardized service called a "Pilet Feed". This service has a consumer facing part and a developer facing part. The latter allows publishing new Pilets.

The Pilet Feed service determines how the contents of a Pilet are stored. Furthermore, it also knows the meta information for each available Pilet. This makes the Pilet Feed service essential for anything related to a Piral.

Publishing a Pilet can be in any form, however, once you want to be standard conform you will need to publish the Pilet (directly or indirectly) via the Pilet Feed service's API. We have integrated the direct way in the CLI to make it super convenient for any developer to publish to any feed that follows the standard specification.

---------------------------------------

## Can pilet metadata (e.g., URLs, tiles, ...) be extracted and used?

This is a feature of, e.g., the feed service. Out of the box no such feature is provided even though it may be useful (e.g., finding what URLs are registered in total vs what URLs are available to the current user).

---------------------------------------

## Can the CLI be extended?

Yes it can. The `piral-cli` looks for globally and locally installed packages that are prefixed with `piral-cli-`, e.g., `piral-cli-local-feed` (documentation [available here](https://www.npmjs.com/package/piral-cli-local-feed)). A CLI plugin can hook into the established commands (e.g., builds, debug, ...), add validation rules, add commands, or extend existing commands (e.g., with flags).

More information can be found in the [package information](https://npmjs.com/package/piral-cli).

---------------------------------------

## What about mono repos?

Piral was developed to be used in distributed environments, where each pilet could be in its own repository. Nevertheless, for convenience and to get a head start we fully support the mono repo use case, too.

We advise you to use the following tools:

1. Yarn: `npm i yarn@1 -g`
2. Lerna: `npm i lerna -g`

To set up a mono repo we encourage you to run in your desired repository:

1. Run `npx lerna init`
2. Add `piral-cli` to `devDependencies`
3. Configure the workspaces
4. Run `lerna create app-shell`
5. Go into the app shell, run `npm init piral-instance`
6. Fill out form, skipping installation of dependencies
7. Run `lerna bootstrap` to resolve all dependencies
8. For new pilets use `pilet new <your-app-shell-name>`
9. Everything should just work as normal

You can still create emulator packages of your app shell, which can be shipped to teams that do not (or cannot / should not) contribute to the mono repo.

---------------------------------------

## Something does not seem supported in an older browser?

This can always be. We ship a module `piral/polyfills` that should bring compatibility even in IE11, however, this also makes some assumptions.

While syntax constructs (e.g., `async` / `await`) should be transpiled fine, they sometimes depend also on runtime capabilities (e.g., `regenerator-runtime`). The `piral/polyfills` module delivers some helpers here, however, especially for API calls there may be no delivered polyfill.

In such cases please find out what you use and which polyfill (additionally to `piral/polyfills`) is required.

Finally, in cases where you target more modern browsers feel free to remove `piral/polyfills` from your imports. The intention of this module is not to cover all cases, but to cover the most important ones.

---------------------------------------
