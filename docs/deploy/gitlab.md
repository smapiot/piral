---
title: GitLab Pages
description: How to deploy your Piral instance to the web using GitLab Pages.
---

# ![GitLab Logo](../logos/gitlab.svg){height=30px} Deploy your Piral instance to GitLab Pages

You can use [GitLab Pages](https://pages.gitlab.io/) to host an Piral instance for your [GitLab](https://about.gitlab.com/) projects, groups, or user account.

## How to deploy

1. Create a file called `.gitlab-ci.yml` in the root of your project.
2. Insert the content below into the yml file. This will build and deploy your site whenever you make changes to your content:

   ```yaml
   # The Docker image that will be used to build your app
   image: node:lts

   pages:
     cache:
       paths:
         - node_modules/
     script:
       # Specify the steps involved to build your app here
       - npm install
       - npm run build
       - cp -r dist/release public

     artifacts:
       paths:
         # The folder that contains the built files to be published.
         # This must be called "public".
         - public

     only:
       # Trigger a new build and deploy only when there is a push to the
       # branch(es) below
       - main
   ```
