---
title: Edgio
description: How to deploy your Piral instance to the web using Edgio.
---

# ![Edgio Logo](../logos/edgio.svg){height=24px} Deploy your Piral instance to Edgio

You can deploy your Piral instance to [Edgio](https://www.edg.io/), an edge and CDN platform to deploy, protect and accelerate websites and APIs.

## How to deploy

1. Install [the Edgio CLI](https://docs.edg.io/guides/cli) globally from the console, if you haven't already.

    ```sh
    npm install -g @edgio/cli
    ```

2. Add Edgio to your Piral instance:

    ```sh
    edgio init
    ```

3. Update the *routes.js* at the root of your project to the following:

    ```js
    import { Router } from '@edgio/core/router'

    export default new Router()
      // Create serveStatic route for each file in the folder dist/release
      // with a cache-control header of 's-maxage=315360000'
      .static('dist/release')
    ```

4. Build your Piral instance:

    ```sh
    npx piral build --type release
    ```

5. Deploy to Edgio:

    ```sh
    edgio deploy
    ```
