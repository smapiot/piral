---
title: Buddy
description: How to deploy your Piral instance to the web using Buddy.
---

# ![Buddy Logo](../logos/buddy.svg){height=24px} Deploy your Piral instance with Buddy

You can deploy your Piral instance using [Buddy](https://buddy.works/), a CI/CD solution that can build your site and push it to many different deploy targets including FTP servers and cloud hosting providers.

::: tip: Note
Buddy itself will not host your site. Instead, it helps you manage the build process and deliver the result to a deploy platform of your choice.
:::

## How to deploy

1. [Create a **Buddy** account](https://buddy.works/sign-up).
2. Create a new project and connect it with a git repository (GitHub, GitLab, BitBucket, any private Git Repository or you can use Buddy Git Hosting).
3. Add a new pipeline.
4. In the newly created pipeline add a **[Node.js](https://buddy.works/actions/node-js)** action.
5. In this action add:

   ```sh
   npm install
   npm run build
   ```

6. Add a deployment action — there are many to choose from, you can browse them in [Buddy's actions catalog](https://buddy.works/actions). Although their settings can differ, remember to set the **Source path** to `dist/release`.
7. Press the **Run** button.
