---
title: Features and Alternatives
---

# Features and Alternatives

## Core Features

Piral comes with the following features:

- Highly modular
- Multi-framework capable
- Bundler independent (works with almost any bundler)
- Central dependency sharing (i.e., from the app shell)
- Distributed dependency sharing (between micro frontends)
- Supports built-time integration, CSR, and SSR
- Global state management
- Independent development and deployment
- CLI tool

The primary target framework of Piral is React, but due to the secondary ("foreign") API, any framework that can be attached to the DOM can be used.

Let's check our list against common checklists for micro frontends.

✔️ **Implementation, complexity, and integration**

> The process is simple and doesn't require learning new complex skills or other frameworks.

Indeed Piral works in a standard configuration by relying only on the npm ecosystem and proper bundling. Our CLI ships with the best bundling configuration, but if you have custom needs you can use any other bundler or bundling configuration.

✔️ **Code isolation and separation of concerns**

> Code and styles are isolated to prevent conflicts or unintended overrides.

A pilet is sandboxed from the main application. It cannot crash the main application or other pilets. Pilet specific translations or state is always kept in isolation. Communication between the pilets is done indirectly via events or extensible components.

✔️ **Separate deployment and team owners**

> Each micro frontend is deployed and managed separately to prevent downtime and reduce deployment time.

A pilet is deployed to a dedicated service or feed independently of the main application, which may be hosted on a CDN. The deployment and release cycle of each pilet is completely independent of each other and the main application.

✔️ **Support different technologies**

> We can use different technologies: React, Angular; and the same one with different versions.

Even though Piral supports this way we strongly recommend avoiding multiple technologies within one application. Nevertheless, it is all possible since every pilet can package up any module. Furthermore, Piral has two APIs for bringing in components; one with the already packaged version of React and a generic API providing a "naked" DOM node to host any framework.

✔️ **Cross-browser compatibility**

> The solution is cross-browser compatible including support for IE11.

Piral itself tries to be as reachable as possible. Currently, the minimum requirement is indeed IE11. If certain corners (e.g., bundle splitting) are cut then support may also include IE10 or even IE9.

✔️ **Performance**

> Browser strategically reloads to prevent memory pollution, network saturation, among others.

One reason for Piral's design is to cache as much as possible and do the most with the least effort.

## Alternative Solutions

We think that Piral hits a sweet spot that makes development easy and fun while making applications robust, flexible, and efficient. Nevertheless, some of the alternatives to Piral are.

| Feature              | Piral  | Module Federation | Single SPA | Web Components | Mosaic   | Luigi   |
|----------------------|--------|-------------------|------------|----------------|----------|---------|
| Available CLI        | ✔️      | ✔️                 | ✔️          | ❌             | ✔️        | ❌       |
| Free Tooling Choice  | ✔️      | ❌                | ✔️          | ✔️              | ❌        | ❌      |
| Bundle Splitting     | ✔️      | ✔️                 | ✔️          | ✔️              | ✔️      | ❌        |
| Multi Framework      | ✔️      | ❌                | ✔️          | ✔️              | ✔️      | ✔️         |
| Main Framework       | React  | Vanilla           | Vanilla    | Polymer        | Vanilla  | Vanilla |
| Standards-Driven     | ✔️      | ✔️                 | ✔️          | ✔️              | ❌      | ❌       |
| Module Communication | ✔️      | ❌                | ✔️          | ✔️              | ❌      | ❌       |
| TypeScript Support   | ✔️      | ❌                | ✔️          | ✔️              | ❌      | ✔️        |
| Stitching Location   | Client | Client            | Client     | Client         | Server   | Client  |
| Free Deployments     | ✔️      | ✔️                 | ❌         | ✔️              | ✔️      | ✔️         |
| Free Development     | ✔️      | ❌                | ❌         | ❌              | ✔️      | ❌        ||
| Decoupled Sharing    | ✔️      | ❌                | ❌         | ❌              | ❌      | ❌       |
| Shared Dependencies  | ✔️      | ✔️                | ✔️          | ❌              | ❌      | ❌       |

(explanation of these features below)

While some of the alternatives focus on multi-frameworks (i.e., having multiple runtimes in the same application) Piral tries to be efficient without having too strong restrictions on the developer. React is preferred, however, if one feels the need there is also an escape hatch to register full components based on a DOM node given by Piral. As such any framework that attaches to a DOM node can be used.

Piral tries to minimize the work required for setting up a micro frontend by not doing a micro frontend. Instead, modules are used, which are independent of a particular backend service. In the end, Piral is not trying to dictate how to cut your architecture, domain model, or available development resources, but rather giving you a toolbox to boost your productivity.

The links for the alternatives listed above.

- [Module Federation](https://webpack.js.org)
- [Single SPA](https://single-spa.js.org)
- [Web Components](https://www.webcomponents.org)
- [Project Mosaic](https://opensource.zalando.com)
- [Luigi](https://github.com/SAP/luigi)

There are more alternatives, which have not been listed for brevity. Some of these are:

- [Open Components](https://opencomponents.github.io)
- [Podium](https://podium-lib.io)
- [Frint.js](https://frint.js.org)
- [One App](https://github.com/americanexpress/one-app)
- [PuzzleJs](https://github.com/puzzle-js/puzzle-js)
- [NUT](https://github.com/nut-project/nut)

## Feature Explanation

**Available CLI**: Is there a CLI that makes common tasks, incl. scaffolding, building, publishing, ... available?

**Free Tooling Choice**: Does the CLI need to be used or can it be replaced?

**Bundle Splitting**: Does bundle splitting with whatever bundler (e.g., webpack) just work (i.e., can the side bundles be resolved)?

**Multi Framework**: Are other frameworks besides the primary UI framework supported?

**Main Framework**: What is the primary UI framework?

**Standards-Driven**: Are the resulting bundles UMD conform or following another (maybe defacto) standard?

**TypeScript Support**: Is the project written in TypeScript and brings an always up-to-date d.ts?

**Stitching Location**: Where is the primary use case/stitching location?

**Free Deployments**: Is the CI/CD pipeline out of the box (i.e., with the initial set up) fully decoupled that app shell and all modules can be deployed independently

**Free Development**: Is the development out of the box (i.e., with the initial set up) free to choose between monorepo, single repo, shared repo, etc. - and still works offline first?

**Decoupled Sharing**: Are aggregator components available that enable a decoupled way of sharing components that are resilient?

**Shared Dependencies**: Can dependencies be shared between the different micro frontends?

## Further Reading

There are further reads on the topic of micro frontends.

- [Awesome Micro Frontends](https://github.com/rajasegar/awesome-micro-frontends)
- [Micro frontends—a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16)
- [Micro Front-Ends: Available Solutions](https://medium.embengineering.com/micro-front-ends-whats-the-best-solution-3bc31218eae4)
- [Exploring micro-frontends](https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c)
- [Micro Frontends - extending the microservice idea to frontend development](https://micro-frontends.org)
- [6 micro-front-end types in direct comparison: These are the pros and cons (translated)](https://bit.ly/2K1zbu2)
- [Micro-frontends decisions framework](https://lucamezzalira.com/2019/12/22/micro-frontends-decisions-framework/)
