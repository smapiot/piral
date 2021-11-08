---
title: Scaffolding
---

# Scaffolding

This section will help you with the process of creating fresh Piral and pilet instances.

## Get Started

The simplest way to scaffold a Piral project is to use the npm initializers. For instance, to create a new Piral instance run:

```sh
npm init piral-instance
```

This scaffolds a new app shell in the current directory.

::: question: Do I need the npm initializers?
No, you can also use the `piral-cli` directly. However, that way you need to have the `piral-cli` globally installed, which is generally not advisable.

With the `piral-cli` installed globally you could run `piral new` instead of the command above.
:::

All options that can be determined will be presented to you in a command line survey. If you want to skip this survey and take the default options you can use the `--defaults` flag:

```sh
npm init piral-instance --defaults
```

We can now create a tarball from this app shell since this is needed to scaffold a related pilet.

Choose the command that fits your taste:

```sh
# run the `piral` command via the `npx` runner
npx piral build

# alternatively, use the set up npm script
npm run build

# of course you can also use yarn or any other npm client
yarn build
```

The generated tarball is now being located under *dist/emulator/*.

Let's create a directory for the pilet next to the app shell's directory. Assuming that the app shell's directory has been called `my-piral-instance` we could run in the pilet's directory:

```sh
npm init pilet --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz
```

Like beforehand, if you don't want to see the survey use the `--defaults` flag:

```sh
npm init pilet --source ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz --defaults
```

Make sure to adapt the command above to the name of your app shell.

::: question: Do I need the npm initializers?
No, same as with the scaffolding of the Piral instance.

With the `piral-cli` installed globally you could run `pilet new ../my-piral-instance/develop/my-piral-instance-1.0.0.tgz` instead of the command above.
:::

This will scaffold a new pilet. The crucial part is the first argument, which is the path to the tarball'ed piral instance.

When scaffolding a new pilet you have to reference an app shell.

## Logging

If you want more information about the scaffolding process you can simply increase the log level (from `0` to `5`):

```sh
piral new my-piral-instance --log-level 5
```

The available log levels are:

- `0`: disabled
- `1`: errors only
- `2`: warnings (and `1`)
- `3`: info (and everything from `2`)
- `4`: verbose (and everything from `3`)
- `5`: debug (essentially `4` with log file output)

## Selecting a Bundler

When scaffolding a Piral instance or pilets you can also specify the bundler:

```sh
npm init pilet --source my-piral-instance --bundler parcel
```

Possible choices are `"none"`, `"esbuild"`, `"parcel"`, `"parcel2"`, `"webpack"` or `"webpack5"`. The bundler can also be changed after the scaffolding process at any time.

## Related Resources

- [new-piral](../commands/new-piral.md)
- [new-pilet](../commands/new-pilet.md)
