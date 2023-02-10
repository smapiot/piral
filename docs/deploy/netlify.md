---
title: Netlify
description: How to deploy your Piral instance to the web on Netlify.
---

# ![Netlify Logo](../logos/netlify.svg){height=24px} Deploy your Piral instance to Netlify

[Netlify](https://netlify.com) offers hosting and serverless backend services for web applications and static websites. Any Piral instance can be hosted on Netlify!

This guide includes instructions for deploying to Netlify through the website UI or Netlify's CLI.

## How to deploy

You can deploy to Netlify through the website UI or using Netlify's CLI (command line interface). The process is the same for both static and SSR Piral instances.

### Website UI Deployment

If your project is stored in GitHub, GitLab, BitBucket, or Azure DevOps, you can use the Netlify website UI to deploy your Piral instance.

1. Click `Add a new site` in your [Netlify dashboard](https://app.netlify.com/).
2. Choose `Import an existing project`.

    When you import your Piral repository from your Git provider, Netlify should automatically detect and pre-fill the correct configuration settings for you.

3. Make sure that the following settings are entered, then press the `Deploy` button:

    - **Build Command:** `npm run build`
    - **Publish directory:** `dist/release`

    After deploying, you will be redirected to the site overview page. There, you can edit the details of your site.

Any future changes to your source repository will trigger preview and production deploys based on your deployment configuration.

::: tip: The netlify.toml file

You can optionally create a new `netlify.toml` file at the top level of your project repository to configure your build command and publish directory, as well as other project settings including environment variables and redirects. Netlify will read this file and automatically configure your deployment.

To configure the default settings, create a `netlify.toml` file with the following contents:

```toml
[build]
  command = "npm run build"
  publish = "dist/release"
```
:::

### CLI Deployment

You can also create a new site on Netlify and link up your Git repository by installing and using the [Netlify CLI](https://cli.netlify.com/).

1. Install Netlify's CLI globally:

    ```sh
    npm install --global netlify-cli
    ```

2. Run the CLI and follow the instructions to log in and authorize Netlify.
3. Run `netlify init` and follow the instructions.
4. Confirm your build command (`npm run build`).

    The CLI could automatically detect the build settings (`npm run build`) and deploy directory (`dist/release`), and will offer to automatically generate [a `netlify.toml` file](#netlifytoml-file) with those settings.

5. Build and deploy by pushing to Git.

    The CLI will add a deploy key to the repository, which means your site will be automatically rebuilt on Netlify every time you `git push`.

### Set a Node.js Version

If you are using a legacy [build image](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) (Xenial) on Netlify, make sure that your Node.js version is set. The Piral CLI should be used with `v14.19.2` or higher.

You can [specify your Node.js version in Netlify](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript) using:
- a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) file in your base directory.
- a `NODE_VERSION` environment variable in your site's settings using the Netlify project dashboard.

## Using Netlify Functions

No special configuration is required to use Netlify Functions with Piral. Add a `netlify/functions` directory to your project root and follow [the Netlify Functions documentation](https://docs.netlify.com/functions/overview/) to get started!
