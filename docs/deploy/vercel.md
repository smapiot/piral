---
title: Vercel
description: How to deploy your Piral instance to the web on Vercel.
---

# ![Vercel Logo](../logos/vercel.svg){height=24px .auto} Deploy your Piral instance to Vercel

You can use [Vercel](http://vercel.com/) to deploy an Piral instance to their global edge network with zero configuration.

This guide includes instructions for deploying to Vercel through the website UI or Vercel's CLI.

## How to deploy

You can deploy to Vercel through the website UI or using Vercel's CLI (command line interface).

### CLI Deployment

1. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel` to deploy.

    ```sh
    npm install -g vercel
    vercel
    ```

2. Vercel will ask you a few questions to configure the right settings. For most questions you can just press "Enter" and take the default.
3. When asked for the directory where the code is located (`In which directory is your code located? ./`), choose `./dist/release`.
4. When asked `Want to modify these settings? [y/N]`, choose `N`.
5. Your application is deployed! (e.g., `piral-shell.vercel.app`)

### Project config with vercel.json

You can use `vercel.json` to override the default behavior of Vercel and to configure additional settings. For example, you may wish to attach headers to HTTP responses from your Deployments.

📚 Learn more about [Vercel's project configuration](https://vercel.com/docs/project-configuration).
