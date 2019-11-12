# Features and Alternatives

## Core Features

Piral comes with the following features:

- Highly modular
- Multi-framework capable
- Integrated translation system
- Support for bundle splitting and asset bundling
- Global state management
- Independent development and deployment
- CLI tool

The primary target framework of Piral is React, but due to the secondary ("foreign") API any framework that can be attached to the DOM can be used.

Let's check our list against common checklists for microfrontends.

✔️ **Implementation, complexity, and integration**

> The process is simple and doesn't require to learn new complex skills or framework.

Indeed Piral works in a standard configuration by relying only on the NPM eco system and proper bundling. Our CLI ships with the best bundling configuration, but if you have custom needs you can use any other bundler or bundling configuration.

✔️ **Code isolation and separation of concerns**

> Code and styles are isolated to prevent conflicts or unintended overrides.

A pilet is sandboxed from the main application. It cannot crash the main application or other pilets. Pilet specific translations or state is always kept in isolation. Communication between the pilets is done indirectly via events or extensible components.

✔️ **Separate deployment and team owners**

> Each microfrontend is deployed and managed separately to prevent downtime and reduce deployment time.

A pilet is deployed to a dedicated service or feed independently of the main application, which may be hosted on a CDN. The deployment and release cycle of each pilet is completely independent from each other and the main application.

✔️ **Support different technologies**

> We can use different technologies: React, Angular; and the same one with different versions.

Even though Piral supports this way we strongly recommend avoiding multiple technologies within one application. Nevertheless, its all possible since every Pilet can package up any module. Furthermore, Piral has two APIs for bringing in components; one with the already packaged version of React and a generic API providing a "naked" DOM node to host any framework.

✔️ **Cross-browser compatibility**

> The solution is cross-browser compatible including support for IE11.

Piral itself tries to be as reachable as possible. Currently, the minimum requirement is indeed IE11. If certain corners (e.g., bundle splitting) are cut then support may also include IE10 or even IE9.

✔️ **Performance**

> Browser strategically reloads to prevent memory pollution, network saturation, among others.

One reason for Piral's design is to cache as much as possible. In the full framework we also make use of GraphQL to leverage live data feeds (subscriptions) and request batching to gain more efficiency.

## Alternative Solutions

We think that Piral hits a sweep spot that makes development easy and fun, while making applications robust, flexible, and efficient. Nevertheless, some of the alternatives to Piral are.

| Feature              | Piral  | Single SPA | Web Components | Mosaic  | Luigi   |
|----------------------|--------|------------|----------------|---------|---------|
| Available CLI        | ✔️     | ✔️         | ❌              | ✔️      | ❌       |
| Free Tooling Choice  | ✔️     | ❌          | ✔️             | ❌       | ❌       |
| Translations         | ✔️     | ❌          | ❌              | ❌       | ✔️      |
| Bundle Splitting     | ✔️     | ✔️         | ✔️             | ✔️      | ❌       |
| Multi Framework      | ✔️     | ✔️         | ✔️             | ✔️      | ✔️      |
| Main Framework       | React  | Vanilla    | Polymer        | Vanilla | Vanilla |
| Modal Manager        | ✔️     | ❌          | ❌              | ❌       | ✔️      |
| Live Data Feed       | ✔️     | ❌          | ❌              | ❌       | ❌       |
| Standards-Driven     | ✔️     | ❌          | ✔️             | ❌       | ❌       |
| Free Deployments     | ✔️     | ✔️         | ✔️             | ✔️      | ✔️      |
| Free Development     | ✔️     | ❌          | ❌              | ✔️      | ❌       |
| Form Management      | ✔️     | ❌          | ❌              | ❌       | ✔️      |
| Search Providers     | ✔️     | ❌          | ❌              | ❌       | ❌       |
| Global State         | ✔️     | ✔️         | ❌              | ❌       | ✔️      |
| Notifications        | ✔️     | ❌          | ✔️             | ❌       | ✔️      |
| Module Communication | ✔️     | ✔️         | ✔️             | ❌       | ❌       |
| TypeScript Support   | ✔️     | ❌          | ✔️             | ❌       | ✔️      |
| Stitching Location   | Client | Client     | Client         | Server  | Client  |

While some of the alternatives focus on multi-frameworks (i.e., having multiple runtimes in the same application) Piral tries to be efficient without having too strong restrictions on the developer. Obviously, React is preferred, however, if one really feels the need there is also an escape hatch to register full components based on a DOM node given by Piral. As such any framework that attaches to a DOM node can be used.

Piral tries to minimize the work required for setting up a microfrontend by not doing a microfrontend. Instead, modules are used, which are independent of a particular backend service. In the end, Piral is not trying to dictate how to cut your architecture, domain model, or available development resources, but rather giving you a toolbox to boost your productivity.

The links for the alternatives listed above.

- [Single SPA](https://single-spa.js.org)
- [Web Components](https://www.webcomponents.org)
- [Project Mosaic](https://www.mosaic9.org)
- [Luigi](https://github.com/SAP/luigi)

## Further Reading

There are further reads on the topic of microfrontends.

- [Micro frontends—a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16)
- [Micro Front-Ends: Available Solutions](https://medium.embengineering.com/micro-front-ends-whats-the-best-solution-3bc31218eae4)
- [Exploring micro-frontends](https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c)
- [Micro Frontends - extending the microservice idea to frontend development](https://micro-frontends.org)
- [6 micro-front-end types in direct comparison: These are the pros and cons (translated)](https://bit.ly/2K1zbu2)
