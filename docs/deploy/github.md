---
title: GitHub Pages
description: How to deploy your Piral instance to the web using GitHub Pages.
---

# ![GitHub Logo](../logos/github.svg){height=24px .auto} Deploy your Piral instance to GitHub Pages

You can use [GitHub Pages](https://pages.github.com/) to host a Piral instance directly from a repository on [GitHub.com](https://github.com/).

## How to deploy

You can deploy an Piral instance to GitHub Pages by using [GitHub Actions](https://github.com/features/actions) to automatically build and deploy your site. To do this, your source code must be hosted on GitHub.

Follow the instructions below to deploy your Piral instance to GitHub pages.

1. Create a new file in your project at `.github/workflows/deploy.yml` and paste in the YAML below.

    ```yaml
    name: Deploy to GitHub Pages

    on:
      # Trigger the workflow every time you push to the `main` branch
      # Using a different branch name? Replace `main` with your branch's name
      push:
        branches: [ main ]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout your repository using git
            uses: actions/checkout@v2
          - name: Install gh-pages
            run: |
              npm install -g gh-pages@3.0.0
          - name: Install Dependencies
            run: |
              npm install
          - name: Build Piral Instance
            run: |
              npx piral build --type release
              cp dist/release/index.html dist/release/404.html

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - name: Deploy Piral Instance
            run: |
              git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
              gh-pages -d "dist/release" -u "github-actions-bot <support+actions@github.com>"
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```

2. On GitHub, go to your repository's **Settings** tab and find the **Pages** section of the settings.
3. Choose **GitHub Actions** as the **Source** of your site.
4. Commit the new workflow file and push it to GitHub.

Your site should now be published! When you push changes to your project's repository, the GitHub Action will automatically deploy them for you.

::: tip: Set up a custom domain
You can optionally set up a custom domain by adding the following step **before** the "Deploy Piral Instance" step (replace `sub.mydomain.com` with your custom domain):

```yaml
- name: Configure Custom Domain
  run: |
    echo "sub.mydomain.com" > dist/release/CNAME
```

This will deploy your site at your custom domain instead of `user.github.io`. Don't forget to also [configure DNS for your domain provider](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).
:::

In case your repository is not named like `user.github.io` you'll also need a public path. By default, the public path is set to `/`, which makes sense for sites directly hosted at `user.github.io`, however, it would not work if your website wil be located at `user.github.io/my-repo`.

For different public paths use `npx piral build --type release --public-url /my-repo` instead of `npx piral build --type release`.
