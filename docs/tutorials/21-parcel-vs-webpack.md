---
title: Parcel vs Webpack
description: Helps to choose the right bundler for your application.
audience: Architects, Developers
level: Proficient
section: Details
---

# Parcel vs Webpack

Piral wants to give you as much freedom as possible. Therefore, the `piral-cli` is not constraint to a single bundler, but instead allows you to integrate whatever bundler you'd like. Officially, we offer the choice between

- Parcel, the known blazing fast zero configuration bundler and
- Webpack, the dominant defacto standard bundler with a huge ecosystem.

But quite often we get asked "which one to choose". If you don't make any choice then Piral will choose for you. Right now **Webpack** is picked as the default bundler.

::: tip: Changing the default bundler

Using a `.piralrc` file in your home directory you can set what default should be used. If you prefer to use **Parcel** as your default bundler then simply provide the following content:

```json
{
  "bundler": "parcel"
}
```

Again, this is only the default in case no bundler was yet determined for the current Piral instance or pilet.

:::

There are multiple ways to choose a default bundler for the current project. Ultimately, the default bundler is the first bundler seen (i.e., installed) in the current project.

Example for a *package.json* (fragment):

```json
{
  "devDependencies": {
    "piral-cli": "latest",
    "piral-cli-webpack": "latest"
  }
}
```

In the case above **Webpack** is chosen as the default bundler.

::: warning: Multiple bundlers

In theory the Piral CLI supports multiple installed bundlers. However, in practice the handling if neither advised nor recommended. Make sure to install only a single Piral CLI plugin providing a bundler integration.

If you see, e.g., `piral-cli-webpack` and `piral-cli-parcel` installed in the `devDependencies` make sure to remove one of the two.

:::

What are the differences between the two bundlers?

## Differences

The best aspect of **Parcel** is that it *just works*. In many cases there is almost nothing to set or configure - Parcel works. It compiles Vue, transpiles TypeScript, works with React and includes proper polyfills. Sounds great, right?

Unless when it does not. The major issue with Parcel is that many crucial aspects are hidden and some things become tedious if not impossible (e.g., using web workers in a different bundle or the special treatment of service workers). Parcel also is quite opinionated about the modules to integrate, which may be an issue with some dependencies.

**Webpack** on the other hand produces a little bit smaller bundlers, has the larger community and is very explicit about its configuration. There is a loader / plugin / etc. for almost anything. The flexibility and ecosystem is vast.

The need for configuration also creates a very fragile and hostile environment. Changes and upgrades are rare and lead to hours and days wasted on making the build system work again. Fortunately, for `piral-cli-webpack` we included a minimum set that should work in the 80% case. We allow configuration extensions to have the remaining 20% covered, too.

This brings us back to the question: When to use what?

## When to use Parcel

In the early days of Piral we decided to make Parcel our default. This was a great choice, as Parcel works just fine for the 80%.

In the best case there is nothing to change. As a result

> Parcel works best if you just want to get started.

Beginners as well as users without very specific build needs will enjoy Parcel a lot.

## When to use Webpack

We switched to Webpack because we think that in the longrun Webpack provides more flexibility and possibilities for Piral. However, we know that Webpack will require configuration for anything serious.

Due to the anticipated configuration need we think that

> Webpack targets more advanced users who have already worked with Webpack.

This fits very well in migration scenarios or when particular build / bundle steps need to be followed. It also simplifies use / migration of frameworks using Stencil or Next.js.

## Pilet vs Piral Instance

There is no need to use the same bundler for a Piral instance and its pilets. Each development team can decide on their own which bundler to use.

The freedom of choice is one of Piral's greatest strengths and was reflected in this design decision.

As app shells tend to be larger and more complex than average pilets we usually see Webpack in favor here. Pilets are usually well off with Parcel.

## Webpack Configuration

To really configure Webpack all we need to do is to create a *webpack.config.js* in the project's root folder.

```js
// Receive the existing config and return a (new) config
module.exports = function(config) {
  return config;
};
```

While the shown format exporting a function is different to the usual one (exporting a config) we prefer this one. In the other case both configurations are merged.

For instance, adding support for SystemJS could be done via the following *webpack.config.js*:

```js
module.exports = function (config) {
  config.module.rules.push({
    parser: {
      system: false,
    },
  });
  config.output.libraryTarget = "system";
  return config;
};
```

## Conclusion

Choosing the right bundler is less about technical possibilities and more about convenience and efficiency. Piral has the two arguably most popular bundlers available out of the box.

In the next tutorial, we'll look at using more low-level packages from Piral, namely `piral-core` and `piral-base`.
