---
title: Piral Instance Metadata
description: The metadata defined for a Piral instance in its package.json.
section: Customization
---

# Piral Instance Metadata

The Piral CLI uses the *package.json* file, as well as an optional *piral.json* file for retrieving useful information. This includes the centrally shared dependencies or validation techniques to apply.

## Package Definition

The additional fields for a Piral instance *package.json* are available as sketched in the following example:

```json
{
  "name": "my-piral-instance",
  // ...
  "app": "src/index.html",
  "importmap": {
    "imports": {
      "my-ui-lib": "my-ui-lib"
    },
    "inherit": [
      "piral-base",
      "piral-core"
    ]
  }
}
```

The `app` field is necessary to signal the HTML file to be used as an entry point to the Piral CLI. All paths are relative to the *package.json*.

The `importmap` defines the shared dependencies from the Piral instance. The `inherit` field lists the packages that already contain shared dependencies. In the previous example, `piral-base` (shares `tslib` etc.) and `piral-core` (shares `react`, `react-router-dom`, etc.) are referenced. If you don't want these dependencies to be shared then remove the respective element from the array.

The `importmap` also gives you the possibility to share other dependencies. In the example above, a package called `my-ui-lib` is shared, too.

Additionally, the optional *piral.json* file can be used to define a bit more about the scaffolding process.

```json
{
  "pilets": {
    "preScaffold": "echo 'Pre Scaffold'",
    "postScaffold": "echo 'Post Scaffold'",
    "preUpgrade": "echo 'Pre Upgrade'",
    "postUpgrade": "echo 'Post Upgrade'",
    "template": "@my-company/pilet-template",
    "files": [
      ".editorconfig",
      "src/mocks",
      {
        "from": "scaffold/test.js",
        "to": "jest.config.js"
      },
      {
        "from": "src/pilet",
        "to": ".",
        "deep": true,
        "once": true
      }
    ],
    "scripts": {
      "publish-pilet": "pilet publish --api-key $PILET_PUBLISH_KEY"
    },
    "devDependencies": {
      "prettier": "^1.16.4"
    },
    "validators": {
      "stays-small": -30
    },
    "packageOverrides": {
      "browserslist": [
        "defaults",
        "not IE 11",
        "not IE_Mob 11",
        "maintained node versions"
      ]
    }
  }
}
```

The `pilets` field is completely optional. All paths are relative to the *piral.json*.

### Pilet Lifecycle Hooks

The `preScaffold`, `postScaffold`, `preUpgrade`, and `postUpgrade` fields provide lifecycle hooks for the scaffolding and upgrading operations in pilets. The content is structurally equivalent to the content inside npm scripts.

The lifecycle hooks are run in the following order:

1. Pre-Scaffold is done after (optionally) creating the directory, but before anything else, e.g., the *tsconfig.json* has been scaffolded.
2. Post-Scaffold is done right before the scaffold command is exited, i.e., after everything has been scaffolded and copied accordingly.
3. Pre-Upgrade is done before anything is touched, i.e., right before the command will start moving things around.
4. Post-Upgrade is done right after the new/updated Piral instance has been added and all files etc. have been touched.

### Pilet Scaffolding Files

The list of `files` contains paths to files relative to the `package.json` that should be copied to the pilet when scaffolding (or upgrading). The idea here is to include common files such as a `.editorconfig`, custom `tsconfig.json`, `tslint.json`, or others to provide some coherence when creating new repositories with pilets.

**Note**: Depending on the development model, no special files may be wanted, e.g., in a monorepo workflow, all essential configuration files such as a *.editorconfig* are already present in the repository's root directory.

If a file is actually a folder then all the folder files are copied. For simple strings that means that all files from, e.g., `src/mocks` are copied to `src/mocks`. If `from` and `to` are specified then the files from `from` are copied to the directory specified in `to`. Note that by default this is shallow.

**Remark**: Besides specifying simple strings, where the relative path from the Piral instance is the same as the relative path from the pilet, the files can also be specified in form of an object containing the source relative path via `from` and the target relative path via `to`. Optionally, `deep` can be specified for directories, which may either be `true` or `false`.

- `from` path relative to the original root (where the package.json of the Piral instance is)
- `to` path relative to the pilet root (where the package.json of the pilet will be)
- `deep` signals if the (`from`) directory should be copied recursively
- `once` signals that the file(s) should only be copied on `pilet new`, **not** `pilet upgrade`

### Pilet Scripts

The determined `scripts` provide an easy way to extend the scripts section of the `package.json` of a new pilet. The reason for this section is - like the `files` section - coherence. Likewise, the `devDependencies` can be used to inject some additional tools into a scaffolded pilet, e.g., a preferred solution for unit test, linting, or style coherence.

In addition to the standard specification using a string for the version, the dependencies listed in the `devDependencies` can also be marked as `true`. Such a `devDependencies` entry will then use the version of the dependency as specified in either the `dependencies` or `devDependencies` of the Piral instance. If no such entry can be found, it will fall back to `"latest"`.

The `validators` field is used to properly assert pilets. There are many validators included in `piral-cli`. Additionally, new validators can be added via CLI plugins. For options on the given `validators` see the `pilet validate` command.

### General Overrides

The `packageOverrides` field is used to determine additional properties to merge into the *package.json* of pilets when **scaffolding**. This will not be used while upgrading. The idea here is to provide some initial values which go beyond the standard template.

::: tip: Use a package.json fragment
Besides specifying additional fields for the *package.json* in the `packageOverrides` field you can also include a *package.json* file in the `files` section. If the target is indeed identical to the pilet's *package.json* then this will not be overwritten, but rather just be merged.

The merging happens *after* the initial project scaffolding, but *before* the critical pilet pieces (e.g., the dev dependency to the app shell) are applied.
:::

### Scaffold Scripts

The `preScaffold` and `postScaffold` installation scripts are run during scaffold (`pilet new`) in the following order:

1. The package from the Piral instance is installed
2. The `preScaffold` script is run, if available
3. Scaffolding tasks, such as updating *package.json* or copying of the files are performed
4. All dependencies are resolved and installed (if wanted)
5. The `postScaffold` script is run, if available

Thus for `preScaffold` and `postScaffold` either scripts via `npx`, general scripts such as Bash scripts, or running Node.js files make sense.

The `preUpgrade` and `postUpgrade` upgrade scripts are run during upgrade (`pilet upgrade`) in the following order:

1. The package from the Piral instance is (re-)installed
2. The `preUpgrade` script is run, if available
3. Scaffolding tasks, such as updating *package.json* or copying of the files are performed
4. All dependencies are resolved and (re-)installed
5. The `postUpgrade` script is run, if available

Thus for `preUpgrade` and `postUpgrade` either scripts via `npx`, general scripts such as Bash scripts, or running Node.js files make sense.

### Template Package

The optional `template` field makes it possible to override the default template to be used when scaffolding a new pilet. By default, the template would be set to `default` (which corresponds to [`@smapiot/pilet-template-default`](https://www.npmjs.com/package/@smapiot/pilet-template-default)). The user still has the possibility to set a different template explicitly when running `pilet new`.

The core requirement for a template package is that it either resolves to a local package name (i.e., using a local file path), to a custom npm package (using a scoped package name such as `@my-company/...`), or an official template such as `empty`, `default`, etc.

The official template names are all shortcuts to `@smapiot/pilet-template-X`, where `X` would be the name of the official template. For instance, `empty` is a shortcut to `@smapiot/pilet-template-empty`.

## Instance Definition

The instance definition found in the *piral.json* files allows further configuration.

## Debug Tools Integraion

The `debugTools` property allows to configure if the debug tools should be always attached or not. If the value is set to `false` (default) then the debug tools are only available in the emulator. If the value is set to `true` then the debug tools will always be integrated.

The debug tools provide the bridge to the [Piral Inspector](https://github.com/smapiot/piral-inspector) and add a couple of properties to the `window` object exposing internal functionality.

Example:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "debugTools": true
}
```

## Debug Tools Customization

The `debugSettings` property defines how the [Piral Inspector](https://github.com/smapiot/piral-inspector) behaves and looks like. It is an object with a couple of properties for confiuguring the Piral Inspector.

- `viewState` defines the initial state of the view state debug option.
- `loadPilets` defines the initial state of the load pilets debug option.
- `hardRefresh` defines the initial state of the hard refresh debug option.
- `viewOrigin` defines the initial state of the view origin debug option.
- `extensionCatalogue` defines the initial state of the extension catalogue debug option.
- `clearConsole` defines the initial state of the clear console debug option.

### Component Isolation

When components from micro frontends are rendered they will either be placed directly in the React render tree (case: React components using the shared version of React) or they will be placed in the render tree by inserting a container element, which is then used to create a new render tree below (case: any other framework, incl. React components using a different version / instance of React). With the modern component isolation the latter case applies for alls scenarios.

By default, the two cases are distinguished in the `classic` setting of the `isolation` property - which allows setting Piral into one of the two modes.

Example:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "isolation": "modern"
}
```

### Shared Files

The `shared` property allows you to define a set of files which are directly shared from the app shell. This makes it possible to import functionality at runtime from the app shell.

Example:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "shared": ["./src/externals.tsx"]
}
```

### Configuring Internal Styles

The internal styles setting found in the `internalStyles` property defines how styles for the custom elements (such as `piral-extension`, `piral-component` etc.) are receiving their styles.

The options include:

- `inline`: Styles are defined via a `style` attribute on the element.
- `sheet`: An additional stylesheet is injected when bundling.
- `none`: There are no styles applied (in this case you will need to set them, or the resulting rendering might look odd).

Example:

```json
{
  "$schema": "https://docs.piral.io/schemas/piral-v0.json",
  "internalStyles": "inline"
}
```
