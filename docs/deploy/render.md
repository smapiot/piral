---
title: Render
description: How to deploy your Piral instance to the web using Render.
---

# ![Render Logo](../logos/render.svg){height=24px} Deploy your Piral instance to Render

You can deploy your Piral instance to [Render](https://render.com/), a service to build websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.

## How to deploy

1. Create a [render.com account](https://dashboard.render.com/) and sign in
2. Click the **New +** button from your dashboard and select **Static Site**
3. Connect your [GitHub](https://github.com/) or [GitLab](https://about.gitlab.com/) repository or alternatively enter the public URL of a public repository
4. Give your website a name, select the branch and specify the build command and publish directory
   - **build command:** `npm run build`
   - **publish directory:** `dist/release`
   - **Environment variables (advanced)**: By default, Render uses Node.js 14.17.0. Add an environment variable with a **Variable key** of `NODE_VERSION` and a **Value** with the Node.js version of your preference (e.g., `16.12.0`) to tell Render to use a different Node.js version. Alternatively, add a [`.node-version`](https://render.com/docs/node-version) or [`.nvmrc`](https://render.com/docs/node-version) file to your project to specify a Node.js version.
5. Click the **Create Static Site** button
