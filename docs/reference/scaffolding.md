# Scaffolding

This section will help you with the process of creating fresh piral and pilet instances.

### Get Started

The simplest way to scaffold a piral project is to use the piral-cli by installing:

```sh
 npm i -g piral-cli
 ```

then:

```sh
piral new myPiralAppShell
```

This will create a new app shell with the folder name myPiralAppShell. The name of the app shell is also set in its package.json. We can now create a tarball from this app shell since this is needed to scaffold a related pilet:

```sh
piral build
```

The generated tarball is now beeing located under *myPiralAppShell/dist/develop/*


We now run:

```sh
pilet new ./myPiralAppShell/develop/myPiralAppShell-1.0.0.tgz --target myPilet
```

This will scaffold a fresh new pilet. The crucial part is the first argument, which is the path to the tarballed piral instance.
When scaffolding a new pilet you have to reference the app shell.

### Logging

If you want more information about the scaffolding process you can simply increase the log level (max 5):

```sh
piral new myPiralAppShell --log-level 5
```

### Selecting a Bundler

When scaffolding a piral instance or pilets you can also specify the bundler:

```sh
piral new myPiralAppShell --bundler parcel
```

Possible choices are `"none"`, `"parcel"` or `"webpack"`. The bundler can also be changed after the scaffolding process at any time.

### Related Resources

-  [new-piral]([https://docs.piral.io/tooling/new-piral](https://docs.piral.io/tooling/new-piral))
-  [new-pilet]([https://docs.piral.io/tooling/new-piral](https://docs.piral.io/tooling/new-pilet))
