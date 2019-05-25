# Features and Alternatives

Piral comes with the following features:

- Highly modular
- Multi-framework capable
- Integrated translation system
- Support for bundle splitting and asset bundling
- Global state management
- Independent development and deployment
- CLI tool

The primary target framework of Piral is React, but due to the secondary ("foreign") API any framework that can be attached to the DOM can be used.

We think that Piral hits a sweep spot that makes development easy and fun, while making applications robust, flexibile, and efficient. Nevertheless, some of the alternatives to Piral are.

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
| Stiching Location    | Client | Client     | Client         | Server  | Client  |

While some of the alternatives focus on multi-frameworks (i.e., having multiple runtimes in the same application) Piral tries to be efficient without having too strong restrictions on the developer. Obviously, React is preferred, however, if one really feels the need there is also an escape hatch to register full components based on a DOM node given by Piral. As such any framework that attaches to a DOM node can be used.

Piral tries to minimize the work required for setting up a microfrontend by not doing a microfrontend. Instead, modules are used, which are independent of a particular backend service. In the end, Piral is not trying to dictate how to cut your architecture, domain model, or available development resources, but rather giving you a toolbox to boost your productivity.

The links for the alternatives listed above.

- [Single SPA](https://single-spa.js.org)
- [Web Components](https://www.webcomponents.org)
- [Project Mosaic](https://www.mosaic9.org)
- [Luigi](https://github.com/SAP/luigi)

There are further reads on the topic of microfrontends.

- [Micro frontends—a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16)
- [Micro Front-Ends: Available Solutions](https://medium.embengineering.com/micro-front-ends-whats-the-best-solution-3bc31218eae4)
- [Exploring micro-frontends](https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c)
- [Taming the front-end monolith](https://blog.logrocket.com/taming-the-front-end-monolith-dbaede402c39)
