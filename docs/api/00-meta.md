---
title: meta
section: Core Pilet API
---

# `meta`

The `meta` object contains information regarding the pilet itself. Using the `meta` object may be helpful for getting the pilet's public URL, it's version, or name.

```ts
export function setup(api: PiletApi) {
  // get's the stored meta data
  console.log(api.meta);
}
```

The type of `meta` is defined to be:

```ts
export interface PiletMetadata {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: string;
  /**
   * Provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally indicates the global require reference, if any.
   */
  requireRef?: string;
  /**
   * Additional shared dependencies from the pilet.
   */
  dependencies: Record<string, string>;
  /**
   * Provides some configuration to be used in the pilet.
   */
  config: Record<string, any>;
  /**
   * The URL of the main script of the pilet.
   */
  link: string;
  /**
   * The base path to the pilet. Can be used to make resource requests
   * and override the public path.
   */
  basePath: string;
};
```

A typical use case is to access `basePath` for building URLs that can fetch static data that was packaged with the pilet:

```js
export function setup(api) {
  const url = `${api.meta.basePath}/config.json`;

  fetch(url).then(res => res.json()).then(data => {
    // do something with data
  });
}
```

Another use case is to access the `config` that was provided by the backend, e.g., with an (frontend) API key:

```js
export function setup(api) {
  const { apiUrl, apiKey } = api.config;
  const authorization = `Bearer ${apiKey}`;

  fetch(apiUrl, { header: { authorization }}).then(res => res.json()).then(data => {
    // do something with data
  });
}
```
