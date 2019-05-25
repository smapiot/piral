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

| Feature              | Piral              | Single SPA         | Web Components     | Mosaic             | Luigi              |
|----------------------|--------------------|--------------------|--------------------|--------------------|--------------------|
| CLI                  | :heavy_check_mark: | :x:                | :x:                | :heavy_check_mark: | :x:                |
| Translations         | :heavy_check_mark: | :x:                | :x:                | :x:                | :heavy_check_mark: |
| Bundle Splitting     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x:                |
| Multi Framework      | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x:                |
| Main Framework       | React              | Vanilla            | Polymer            | Vanilla            | Vanilla            |
| Modal Manager        | :heavy_check_mark: | :x:                | :x:                | :x:                | :heavy_check_mark: |
| Live Data Feed       | :heavy_check_mark: | :x:                | :x:                | :x:                | :x:                |
| Standards-Driven     | :heavy_check_mark: | :x:                | :heavy_check_mark: | :x:                | :x:                |
| Free Deployments     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Free Development     | :heavy_check_mark: | :x:                | :x:                | :heavy_check_mark: | :x:                |
| Form Management      | :heavy_check_mark: | :x:                | :x:                | :x:                | :heavy_check_mark: |
| Search Providers     | :heavy_check_mark: | :x:                | :x:                | :x:                | :x:                |
| Global State         | :heavy_check_mark: | :heavy_check_mark: | :x:                | :x:                | :heavy_check_mark: |
| Notifications        | :heavy_check_mark: | :x:                | :heavy_check_mark: | :x:                | :heavy_check_mark: |
| Module Communication | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x:                | :x:                |
| TypeScript Support   | :heavy_check_mark: | :x:                | :heavy_check_mark: | :x:                | :heavy_check_mark: |

While some of the alternatives focus on multi-frameworks (i.e., having multiple runtimes in the same application) Piral tries to be efficient without having too strong restrictions on the developer. Obviously, React is preferred, however, if one really feels the need there is also an escape hatch to register full components based on a DOM node given by Piral. As such any framework that attaches to a DOM node can be used.

There are further reads on the topic of microfrontends.

- [Micro frontends—a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16)
- [Micro Front-Ends: Available Solutions](https://medium.embengineering.com/micro-front-ends-whats-the-best-solution-3bc31218eae4)
- [Exploring micro-frontends](https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c)
- [Taming the front-end monolith](https://blog.logrocket.com/taming-the-front-end-monolith-dbaede402c39)

The alternatives in detail:

- [Single SPA](https://single-spa.js.org)
- [Web Components](https://www.webcomponents.org)
- [Project Mosaic](https://www.mosaic9.org)
- [Luigi](https://github.com/SAP/luigi)
