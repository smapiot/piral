---
title: Migration of Existing Applications
description: Illustrates how existing applications can be migrated conveniently.
audience: Architects, Developers
level: Advanced
---

# Migration of Existing Applications

We know that many applications won't be rewritten just because a new framework or architectural pattern is in fashion. In the end Piral does not want to capture you or your application. Likewise, we don't want you to be captured by your current choice. Therefore, our aim is it to be as simple and straightforward as possible for a migration.

In this tutorial we look at three existing sample applications and discuss their migration paths.

## Custom React Application

For this scenario we assume that the React-based application has been bundled using Webpack.

(tbd)

## Create React App

For this scenario we assume that the application was scaffolded using `create-react-app` (CRA). Under the hood, CRA uses Webpack, too. Nevertheless, there is a significant amount of loaders, plugins, and settings that went into this.

(tbd)

## Next.js

For this scenario we assume that the application was created using the Next.js boilerplate. Again, under the hood this uses Webpack. The additional problems arise through custom parts like the Next.js router or the mixed client-side and server-side rendering.

(tbd)

## Conclusion

Migrating to Piral is simple and straight forward. Since Piral tries to be as easy and shallow to integrate as possible you can just leverage all the React components that you already have.
