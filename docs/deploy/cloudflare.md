---
title: Cloudflare Pages
description: How to deploy your Piral instance to the web using Cloudflare Pages.
---

# ![Cloudflare Logo](../logos/cloudflare.svg){height=24px} Deploy your Piral instance to Cloudflare Pages

You can deploy your Piral instance on [Cloudflare Pages](https://pages.cloudflare.com/), a platform for frontend developers to collaborate and deploy static (JAMstack) and SSR websites.

This guide includes:

- [How to deploy through the Cloudflare Pages Dashboard](#how-to-deploy-a-site-with-git)
- [How to deploy using Wrangler, the Cloudflare CLI](#how-to-deploy-a-site-using-wrangler)

## Prerequisites

To get started, you will need:

- A Cloudflare account. If you don't already have one, you can create a free Cloudflare account during the process.
- Your app code pushed to a [GitHub](https://github.com/) or a [GitLab](https://about.gitlab.com/) repository.

## How to deploy a site with Git

1. Set up a new project on Cloudflare Pages.
2. Push your code to your git repository (GitHub, GitLab).
3. Log in to the Cloudflare dashboard and select your account in **Account Home** > **Pages**.
4. Select **Create a new Project** and the **Connect Git** option.
5. Select the git project you want to deploy and click **Begin setup**
6. Use the following build settings:

    - **Framework preset**: `None`
    - **Build command:** `npm run build`
    - **Build output directory:** `dist/release`
    - **Environment variables (advanced)**: By default, Cloudflare Pages uses Node.js 12.18.0, but the Piral CLI requires a higher version (at least 14).

    Add an environment variable with a **Variable name** of `NODE_VERSION` and a **Value** of `v14.19.2` or higher to tell Cloudflare to use a compatible Node version. Alternatively, add a `.nvmrc` file to your project to specify a Node version.

7. Click the **Save and Deploy** button.

## How to deploy a site using Wrangler

1. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Authenticate Wrangler with your Cloudflare account using `wrangler login`.
3. Run your build command.
4. Deploy using `npx wrangler pages publish dist`.

    ```sh
    # Install Wrangler CLI
    npm install -g wrangler
    # Login to Cloudflare account from CLI
    wrangler login
    # Run your build command
    npm run build
    # Create new deployment
    npx wrangler pages publish dist/release
    ```

After your assets are uploaded, Wrangler will give you a preview URL to inspect your site. When you log into the Cloudflare Pages dashboard, you will see your new project.

### Enabling Preview locally with Wrangler

For the preview to work, you must install `wrangler`:

```sh
npm install wrangler --save-dev
```

It's then possible to update or add a preview script to run `wrangler` in the *package.json*:

```json
{
  // ...
  "scripts": {
    // ...
    "preview": "wrangler pages dev ./dist/release"
  }
}
```

## Troubleshooting

If you're encountering errors, double-check the version of `node` you're using locally (`node -v`) matches the version you're specifying in the environment variable.
