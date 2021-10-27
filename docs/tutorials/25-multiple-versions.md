---
title: Sharing Multiple Versions
description: Some strategies to share multiple versions of the same dependency.
audience: Architects, Developers
level: Proficient
section: Details
---

# Sharing Multiple Versions

You have already seen that [the app shell allows you to share a dependency](./13-sharing-from-piral.md). You also saw that the sharing of dependencies is not restricted to the app shell. You can also share [directly between the pilets](./15-share-dependencies.md). The latter implicitly allows you to share multiple versions of the same dependency.

Sometimes, however, you already went into the first model - sharing dependencies from your app shell. Let's explore what options exist if you want to safely migrate to a newer version here, where support for the old version should still be given.

## Using npm Aliases

The npm package system supports the inclusion of multiple versions from the same package. To use this feature you need to specify alternative names for the different versions.

Example. Consider the following *package.json*:

```json
{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "4.17.21"
  }
}
```

Let's say we would want to use multiple versions of `lodash`. Besides the selected `4.17.21` we may want to use `3.10.1` (the last v3). To make this happen we can write:

```json
{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "lodashV4": "npm:lodash@4.17.21",
    "lodashV3": "npm:lodash@3.10.1"
  }
}
```

Here, we introduced two "new" package names: *lodashV4* and *lodashV3*. These are resolved via the specified `npm` package quantifiers `lodash@4.17.21` and `lodash@3.10.1`.

We could still use `lodash` as a name, but the recommendation is to come up with a consistent naming scheme. Alternatively, you could do something like:

```json
{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "latest",
    "lodashV4": "npm:lodash@4.17.21",
    "lodashV3": "npm:lodash@3.10.1"
  }
}
```

This way you could have a variation of `lodash` that always refers to the latest release (or a specific one, such as the latest v4) and then specific "fixed" identifiers such as the `lodashV4` and `lodashV3` names.

Now you can refer to the different versions via their aliases:

```ts
import { last } from 'lodashV4';
import { escape } from 'lodashV3';

// ...
```

To make this work with TypeScript you don't need to do anything - at least in the case where the typings are part of the package. If they are not (which is the case for the example above) then you'll need to do the trick also with the type packages:

```json
{
  "name": "example",
  "version": "1.0.0",
  "devDependencies": {
    "@types/lodashV4": "npm:@types/lodash@4",
    "@types/lodashV3": "npm:@types/lodash@3"
  },
  "dependencies": {
    "lodashV4": "npm:lodash@4.17.21",
    "lodashV3": "npm:lodash@3.10.1"
  }
}
```

Now TypeScript can resolve the type package for `lodashV4` via the `@types/lodashV4` package, which has been downloaded from npm via the package quantifier `@types/lodash@4` (obtaining the most recent v4 typing package).

## Defining a Version Selector

We could try to go one step forward. Let's see we use the npm aliases of the previous section to define (and then share) multiple versions of the same dependency. How can we dynamically resolve it all fine (**from a pilet**)?

What we want is:

- In case the used version (e.g., version 4 of lodash) in the pilet is matching one provided in the app shell - take the shared one (i.e., external)
- In case the used version (e.g., version 5 of lodash) in the pilet is not matching any provided in the app shell - bundle the currently used version with the pilet

For the second bullet point you can also aim for a refinement, where you'd use pilet-shared dependencies to not directly bundle the dependency, but use one from the app shell if provided, otherwise take a version. In this guide we will not focus on this refinement. Let's try to get the goal above working using **Webpack** as our bundler.

Our assumption is that the app shell was built with the following externals, i.e., shared dependencies:

- `lodashV3`
- `lodashV4`
- (more generic externals such as `react` or `react-dom`)

Importantly, `lodash` was not set as a shared dependency.

We need to have a few helpers to accomplish the goals above. We start with a helper to determine the current version of the dependency in question. Following the example above we choose `lodash` as this dependency:

```js
function getLodashVersion() {
  try {
    const { version } = require('lodash/package.json');
    const [major] = version.split('.');
    return major;
  } catch {
    // ignore, potentially not really installed
  }

  return undefined;
}
```

This gets us the used / installed version in the current repository. As an example, if `lodash` was installed in version `5.4.3` we'd get `"5"`. If it's installed as `4.1.2` we'd get `"4"`.

Now we need to use this to manipulate the set externals. A little helper would be great again. The following piece helps:

```js
function getExternals(externals) {
  const lodashVersion = getLodashVersion();
  const externalNames = Object.keys(externals);

  // check if we have a "known" (i.e., "shared") version of lodash
  if (lodashVersion) {
    const target = `lodashV${lodashVersion}`;

    // check if its shared
    if (externalNames.includes(target)) {
      // redirect lodash to the shared version of lodash, otherwise its bundled
      externals.lodash = target;
    }
  }

  return externals;
}
```

In case of a known version of lodash we would change the created externals object. Otherwise, the externals object stays as-is and does not contain any target redirect.

Finally, we can put everything together in the *webpack.config.js* of the pilet:

```js
function getLodashVersion() {
  try {
    const { version } = require('lodash/package.json');
    const [major] = version.split('.');
    return major;
  } catch {
    // ignore, potentially not really installed
  }

  return undefined;
}

function getExternals(externals) {
  const lodashVersion = getLodashVersion();
  const externalNames = Object.keys(externals);

  // check if we have a "known" (i.e., "shared") version of lodash
  if (lodashVersion) {
    const target = `lodashV${lodashVersion}`;

    // check if its shared
    if (externalNames.includes(target)) {
      // redirect lodash to the shared version of lodash, otherwise its bundled
      externals.lodash = target;
    }
  }

  return externals;
}

module.exports = config => {
  config.externals = getExternals(config.externals);
  return config;
};
```

If this file should be part of all your pilets then place it already in the app shell and configure a scaffolding rule for it. [More on this topic in the reference section](../reference/scaffolding.md).

## Conclusion

In this tutorial you've seen different strategies to mitigate issues that may appear when you want to share multiple versions of the same dependency. Clearly, the best way forward is to rely on the implicit sharing of dependencies between your pilets. As seen, Piral allows you to move forward in various ways making it possible to find the right solution for your problem.
