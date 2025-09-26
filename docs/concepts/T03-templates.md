---
title: Templates
description: Details about the templates used for new pilets and Piral instances.
section: Tooling
---

The `piral-cli` comes with a templating system that is used when you run `piral new` or `pilet new` (or derived scripts like the npm initializers `npm init piral-instance`/`npm init pilet`).

## Rules for Selecting a Template

Simple (i.e., non-namespaced) template names are always expanded to `@smapiot/piral-template-<name>` or `@smapiot/pilet-template-<name>` packages. Therefore, the template name `default` corresponds to `@smapiot/piral-template-default` for a new Piral instance and `@smapiot/pilet-template-default` for new pilets.

Name selection for Piral instance templates:

1. If a local path (relative or absolute) is provided then use this
2. If no `@` (namespaced) name is provided then use `@smapiot/piral-template-<name>` as package name
3. If a namespaced name is provided then take the template name as package name

Name selection for pilet templates:

1. If a local path (relative or absolute) is provided then use this
2. If no `@` (namespaced) name is provided then use `@smapiot/pilet-template-<name>` as package name
3. If a namespaced name is provided then take the template name as package name

If you specify a namespaced template name such as `@foo/bar` then it will be taken as a package name. In this case, `@foo/bar` will be searched in the currently selected registry. If nothing is found then the standard public npm registry will be used for the lookup.

Registry selection:

1. The registry provided via `--registry` or `--npm-registry` when running the scaffolding command
2. The public npm registry

## Building a Custom Template

A custom template is just an npm package that fulfills the following requirements:

1. Expose a **CommonJS module** (`main` in the *package.json*)
2. Have a `default` export being a function specified below
3. Have `template` and either `pilet` (for pilets) or `piral` (for Piral instances) as keyword

The function is defined as

```ts
interface PiletTemplate {
  (projectRoot: string, args: PiletTemplateArgs, details: ExecutionDetails): Promise<Array<TemplateFile>>;
}

interface PiralInstanceTemplate {
  (projectRoot: string, args: PiralTemplateArgs, details: ExecutionDetails): Promise<Array<TemplateFile>>;
}
```

where the arguments are defined to be

```ts
interface TemplateArgs {
  language?: 'js' | 'ts';
  src?: string;
  mocks?: string;
}

interface PiletTemplateArgs extends TemplateArgs {
  sourceName: string;
  plugins?: Record<string, boolean>;
}

interface PiralTemplateArgs extends TemplateArgs {
  packageName?: 'piral' | 'piral-core' | 'piral-base';
  title?: string;
  plugins?: Array<string>;
  reactVersion?: number;
}

interface TemplateFile {
  path: string;
  content: Buffer;
}

interface ExecutionDetails {
  cliVersion: string;
  forceOverwrite: ForceOverwrite;
  isWindows: boolean;
  logLevel: LogLevels;
}
```

This way, the template packages are essentially factories to create virtual files which are then written out by the `piral-cli`.

The easiest way to have a convenient codebase and adhere to the CommonJS output is to use a bundler such as `esbuild`. For instance, the following code (stored in *src/index.js*) would not work directly:

```js
import { createPiletTemplateFactory } from '@smapiot/template-utils';

const root = resolve(__dirname, '..');

export default createPiletTemplateFactory(root, () => [
  {
    languages: ['js', 'ts'],
    name: 'foo.txt',
    target: '<src>/foo.txt',
  },
]);
```

Here, we use an ES module. To bring that conveniently and efficiently into a CommonJS module you can use the following *package.json*:

```json
{
  "name": "@custom/template",
  "version": "1.0.0",
  "keywords": ["template", "pilet"],
  "engines": {
    "node": ">=16.0",
    "piral": "1.x"
  },
  "templateOptions": {},
  "author": "Your name",
  "license": "MIT",
  "main": "lib/index.js",
  "files": [
    "lib",
    "src",
    "templates"
  ],
  "scripts": {
    "build": "esbuild src/index.js --bundle --outfile=./lib/index.js --platform=node"
  },
  "devDependencies": {
    "@smapiot/template-utils": "^1.0.13"
  }
}
```

Importantly, you can run `npm run build` to convert the original ES module codebase to a single file stored in *lib/index.js*. This way, you do not need to declare runtime dependencies such as `@smapiot/template-utils` (they can remain a development-only dependency) and you obtain a legit CommonJS module.
