# Scaffolding
This section will help you with the process of creating fresh piral and pilet instances.


### Get started
The simplest way to scaffold a piral project is to use the piral-cli by installing:

`npm i -g piral-cli`

then:

`piral new myPiralAppShell`

This will create a new app shell with the folder name myPiralAppShell. The name of the app shell is also set in its package.json. We can now create a tarball from this app shell since this is needed to scaffold a related pilet:

`piral build`

The generated tarball is now beeing located under *myPiralAppShell/dist/develop/*

We now run:

`pilet new ./myPiralAppShell/develop/myPiralAppShell-1.0.0.tgz --target myPilet`

This will scaffold a fresh new pilet. The crucial part is the first argument which is the path to the tarballed piral instance.
When scaffolding a new pilet you have to reference the app shell.


### Logging
If you want more information about the scaffolding process you can simply increase the log level (max 5):

`piral new myPiralAppShell --log-level 5`

### Selecting a bundler

When scaffolding a piral instance or pilets you can also specify the bundler:

`piral new myPiralAppShell --bundler parcel`

Possible choices are `"none"`, `"parcel"` or `"webpack"`. The bundler can also be changed after the scaffolding process at any time.

### Related errors
- [0010]([https://docs.piral.io/reference/codes/0010](https://docs.piral.io/reference/codes/0010)) This error may occour when you want to scaffold a pilet but the Piral instance defined in the package.json could not be found.
- [0011]([https://docs.piral.io/reference/codes/0011](https://docs.piral.io/reference/codes/0011)) This error may occour when you want to scaffold a pilet but the Piral instance defined in the package.json is invalid.

### Related Resources
- [new-piral]([https://docs.piral.io/tooling/new-piral](https://docs.piral.io/tooling/new-piral))
- [new-pilet]([https://docs.piral.io/tooling/new-piral](https://docs.piral.io/tooling/new-pilet))
