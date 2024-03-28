---
title: Monorepo
description: How to set up a monorepo with Piral.
audience: Architects, Developers
level: Proficient
section: Details
---

# Monorepo

While Piral was designed primarily for distributed development, i.e., a setup where each micro frontend lives in its own repository, you can use Piral with any paradigm that you like. This includes having a monorepo, i.e., one single repository where many (or all) of your pilets are developed.

Using a monorepo can have many advantages, but can, on the flipside, also create new challenges. For instance, you'll have to ensure that deployments are only made for the changed pilets. Otherwise, you'll end up with a hidden monolith.

In this tutorial, we'll walk over using Piral with a monorepo. We start by looking at the different types of repositories and distributed development strategies, before setting up a monorepo with [Lerna](https://lerna.js.org) or [Rush](https://rushjs.io/).

## Types of Repositories

The first type is the "central monorepo". This may be among the most popular patterns for distributed frontends in general; a monorepo. As mentioned, the monorepo is a single repository that hosts multiple packages. There are many tools to create monorepos, applications such as Lerna, Rush, Nx, or Yarn (with Workspaces) are great tools to manage their complexity.

Another type is the "central pipeline", which decomposes the monorepo into individual repositories with one exception: The build pipeline remains in the monorepo and aggregates the individual repositories into a single (fat) pipeline.

A third type is the "distributed monorepo". In comparison to the previous "central pipeline" type where the repositories are scattered, but use a single pipeline, the "distributed monorepo" keeps all packages in a single repository while scattering the pipelines into multiple repositories. This allows developing the UI, including all fragments, in a central place, while still leaving room for each team to have its own deployment processes.

Finally, the type where Piral truly shines is called "independent repositories". This is the hardest to achieve correctly, and therefore the perfect use case for Piral. Here, you will be having totally independent repositories with their own build processes, giving each team full autonomy.

Of course, hybrids of these types are legit, too.

## Strategies with Piral

Independent of the reasons for choosing a monorepo you'll potentially desire one of the following compositions in your monorepo.

- Piral instance with helper libraries (shell monorepo)
- Piral instance with selected pilets (core monorepo)
- A collection of pilets (domain monorepo)

Any of these types may make sense depending on your problem and the available resources to solve it. From an implementation point of view, the Piral instance with selected pilets may be the most difficult to set up - which is why we'll focus on this one here. However, the other two would not be so different. Let us know on [Discord](https://discord.gg/kKJ2FZmK8t) or [GitHub](https://github.com/smapiot/piral) if you need more help - we are always happy to assist.

## Setting up a Monorepo

If you want to learn how to set up a monorepo with piral, choose one of these two options:

- [Setting up a monorepo with Piral and Lerna](./23.1-monorepo-lerna.md)
- [Setting up a monorepo with Piral and Rush](./23.2-monorepo-rush.md)

In the next tutorial, we'll look into the details of setting up a monorepo using Lerna.
