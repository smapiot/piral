---
title: Heroku
description: How to deploy your Piral instance to the web using Heroku.
---

# ![Heroku Logo](../logos/heroku.svg){height=24px .auto} Deploy your Piral instance to Heroku

[Heroku](https://www.heroku.com/) is a platform-as-a-service for building, running, and managing modern apps in the cloud. You can deloy an Piral instance to Heroku using this guide.

## How to deploy

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
2. Create a Heroku account by [signing up](https://signup.heroku.com/).
3. Run `heroku login` and fill in your Heroku credentials:

   ```sh
   heroku login
   ```

4. Create a file called `static.json` in the root of your project with the below content:

   `static.json`:

   ```json
   {
     "root": "./dist/release"
   }
   ```

   This is the configuration of your site; read more at [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

5. Set up your Heroku git remote:

   ```sh
   # version change
   git init
   git add .
   git commit -m "My site ready for deployment."

   # creates a new app with a specified name
   heroku apps:create example

   # set buildpack for static sites
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. Deploy your site:

   ```sh
   # publish site
   git push heroku master

   # opens a browser to view the Dashboard version of Heroku CI
   heroku open
   ```
