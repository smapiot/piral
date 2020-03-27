---
title: Sharing From Piral
description: How to share information from the Piral instance.
audience: Architects, Developers
level: Advanced
---

# Sharing From Piral

Sharing data between pilets is certainly one use case, however, the more important one is distributing information from the app shell to the modules. A Piral instance can easily distribute information among the pilets in multiple ways. In this tutorial we go over these ways.

Depending on what we want to share one way or another may be applicable.

## Video

We also have this tutorial available in form of a video.

@[youtube](https://youtu.be/UToVUmG5aFI)

## Using a Shared Package

Sharing components or other (global, i.e., not really Piral instance dependent) functionality should be done with packages. The idea is that the package is included in the app shell as a shared dependency.

To automatically share a package the `package.json` of the Piral instance needs to changed. Using the `externals` field in the `pilets` section we can just add the package.

```json
{
  // ...
  "dependencies": {
    "reactstrap": "latest",
    // ...
  },
  "pilets": {
    "externals": [
      "reactstrap"
    ],
  }
}
```

**Note**: Don't forget to add the dependency also to the `dependencies` section.

This way is our recommendation for core libraries (e.g., `react`, `react-dom`, ...) and component libraries such as the primary pattern library. It can, however, also be used for utility libraries (e.g., `lodash`) or other useful libraries.

## Using the Global Data State

We can also use the global state for sharing information. However, since pilets have no direct access to the global data store we need to choose a proper location first. One possibility is to use the `data` section, which is already exposed via the `getData` / `setData` Pilet APIs.

This reduces the effort to actually setting the data state. We have a couple of options.

First, we could just use the "root" pilet, which is a pilet always given for the Piral instance itself. This pilet is retrieved from the created Piral instance object.

In code this looks as follows:

```ts
const instance = createInstance({ ... });
instance.root.setData('foo', 'bar');
```

Alternatively, we do not go over the root pilet, but use the context-specific actions. These actions are also part of the created Piral instance object.

```ts
const instance = createInstance({ ... });
instance.context.writeDataItem('foo', 'bar');
```

The latter also allows you to set expiration and owner directly and will always write. The former behaves exactly as if a pilet would write.

We also have access to the actions within React components defined in the Piral instance. The `useAction` hook gives us a possibility to obtain a reference to the previously mentioned `writeDataItem` action. This can look as follows:

```ts
const MyComponentInPiral = () => {
  const setData = useAction('writeDataItem');
  setData('foo', 'bar');
  return <div>Render something</div>;
};
```

Besides the possibility of using the action we can also just initialize the state properly when we create the Piral instance object.

```ts
const instance = createInstance({
  state: {
    data: {
      foo: {
        value: 'bar',
        owner: '',
        target: 'memory',
        expires: -1,
      },
    },
  },
});
```

This way is our recommendation for static data and functions that do not change very often, if at all. Once, however, data changes quite often - or should be strongly typed to ensure availability we recommend creating an API.

## Extending the Pilet API

The best way to share functions (or information in general) is to provide an API from the Piral instance. For simple (and not so important) parts this may be overkill, but for anything crucial it's the best way to go.

There are several reasons:

- An API is well defined
- An API is visible / strongly typed
- An API can be customized *per* pilet
- APIs are protected and cannot be changed

This could be done as simple as:

```ts
function createCustomApi() {
  // return a constructor using the global context
  return context => {
    // return a constructor for each local API using the pilet's metadata
    return (api, meta) => ({
      foo: 'bar', // this is the API to return; just a "static" foo - but you could have functions, etc.
    });
  };
}

const instance = createInstance({
   extendApi: [createCustomApi()],
});
```

After having this set up to the Piral instance object we can use the API in *every* pilet.

```ts
export function setup(app: PiletApi) {
  const result = app.foo(); // returns 'bar'
}
```

Obviously, the API can be much more dynamic and powerful (e.g., even coupling to the global state context) depending on the exact needs.

This way is our recommendation for dynamic data and functions that require protection. Besides building convenience wrappers around the global state container it can also leverage pilet specific behavior.

## Conclusion

Sharing information from the Piral instance can be done in multiple ways. Depending on the needs of the application and its pilets one way or another may be the best. Usually, an app shell uses all these ways to build an outstanding experience for both - users and developers.

In the next tutorial an advanced concept of Piral will be explained: converters. Converters are the secret sauce to allow cross framework presentation of components.
