---
title: Kras Configuration
description: The possibilities of configuring the kras proxy server.
section: Tooling
---

# Kras Configuration

The CLI uses [kras](https://www.npmjs.com/package/kras) to resolve a `.krasrc` configuration file.

In this file you an place any configuration you'd like to extend the standard capabilities of the kras proxy server, which is used as a central proxy between the development server and any other servers (real or mocked).

## Piral Injector

The `piral` injector can be used to configure how the application code is loaded. This makes it possible to introduce, e.g., custom headers (such as [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)) into the response - testing the app shell with different settings.

```json
{
  "piral": {
    "headers": {
      "Content-Security-Policy": "default-src 'self'"
    }
  }
}
```

## Pilet Injector

The `pilet` injector can be used to define the URL to be used when retrieving the pilet assets and metadata. By default, this URL is fully determined by the caller, which is in most cases what you want.

```json
{
  "injectors": {
    "pilet": {
      "assetUrl": "http://custom-domain.com/pilet"
    }
  }
}
```

You can also define if the config entries from remote pilets (i.e., obtained from a given feed) should be merged. This way, local pilets would still be preferred to remote ones, however, the config values (if any) would be copied over.

```json
{
  "injectors": {
    "pilet": {
      "mergeConfig": true
    }
  }
}
```

Addtionally, the `pilet` injector can also define `headers` like the `piral` injector.

```json
{
  "pilet": {
    "headers": {
      "Content-Security-Policy": "default-src 'self'"
    }
  }
}
```
