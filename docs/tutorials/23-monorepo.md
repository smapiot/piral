---
title: Monorepo
description: How to set up a monorepo with Piral.
audience: Architects, Developers
level: Proficient
section: Details
---

# Monorepo

While Piral was designed primarily for distributed development, i.e., where each microfrontend lives in its own repository, you can use Piral with any paradigm that you like. This includes having a monorepo, i.e., one repository where many (or all) of your pilets are developed.

Using a monorepo can have many advantages. However, keep in mind that some challenges arise, too. For instance, you'll have to take care that deployments are only done for the changed pilets otherwise you'll end up with a hidden monolith.

In this tutorial we'll walk over using Piral with a monorepo. We start by looking at the different types of repositories and distributed development strategies, before setting up a monorepo with [Lerna](https://lerna.js.org).

## Types of Repositories

The first type is the "central monorepo". This may be among the most popular patterns for distributed frontends in general; a monorepo. As mentioned, the monorepo is a single repository that hosts multiple packages. There are many tools to create monorepos, applications such as Lerna, Nx, or Yarn (with Workspaces) are great tools to manage their complexity.

Another type is the "central pipeline", which decomposes the monorepo into individual repositories with one exception: The build pipeline remains in the monorepo and aggregates the individual repositories into a single (fat) pipeline.

A third type is the "distributed monorepo". In the previous pattern we scattered the repositories, but kept the single pipeline. What if we wanted to do it the other way round? Does it even make sense? It turns out, it may be useful. Potentially, we want to develop the UI incl. all fragments in a central place, but we still want to leave room for each team to have their own deployment processes.

Finally, the type of repositories where Piral shines fully is "independent repositories". This is the hardest to achieve correctly, and therefore the perfect use case for Piral. In this type you will be having totally independent repositories with their own build processes giving each team full autonomy.

Of course, hybrids of these types are legit, too.

## Strategies with Piral

Independent of the reasons for choosing a monorepo you'll potentially desire one of the following compositions in your monorepo.

- Piral instance with helper libraries (shell monorepo)
- Piral instance with selected pilets (core monorepo)
- A collection of pilets (domain monorepo)

Any of these types may make sense depending on your problem and the available resources to solve it. From an implementation point of view, the Piral instance with selected pilets may be the most difficult to set up - which is why we'll focus on this one here. However, the other two would not be so different. Let us know on [Gitter](https://gitter.im/piral-io/community) or [GitHub](https://github.com/smapiot/piral) if you need more help - we are always happy to assist.

## Setting up Lerna with Piral

Let's start a new monorepo and add a Piral instance with some pilets. We begin with a new fresh directory:

```sh
git init
npm init -y
npx lerna init
```

With these three commands we

1. initialize a new git repository,
2. start a new NPM project, and
3. apply Lerna to the new NPM project.

You might be wondering "what is this Lerna"? Lerna is a Node.js command line tool that allows you to manage monorepos. Classically, monorepos might be difficult to deal with as you might need to jump to different directories, patch multiple files at once, cannot really reference other packages in the monorepo, or have trouble with versioning of these packages. Lerna helps you will of that - and more.

At this point we should see four items in the directory:

1. *.git* (from the first command, the directory where git stores its information)
2. *lerna.json* (from the third command, the file configuring Lerna)
3. *package.json* (from the second command, patched in the third command)
4. *packages* (from the third command, a directory to store the Piral instance and pilets)

Great! In general, we recommend using Yarn workspaces with Lerna. This makes Lerna even more efficient and robust. Instead of having Lerna to deal with packages, Lerna is only a tool runner, while the heavy burden of package management goes to Yarn (v1), which is a proven and fast solution.

To achieve this we need two things:

1. Change the *lerna.json* to contain `"npmClient": "yarn"` and `"useWorkspaces": true`
2. Add `"workspaces": ["packages/*"]` to the *package.json* and make sure that the *package.json* contains `"private": true`

All in all these files should now look similar to the ones in the [monorepo sample](https://github.com/piral-samples/piral-monorepo-sample).

Let's now install the Piral CLI as a shared dev dependency for this monorepo:

```sh
yarn add piral-cli --dev
```

Now let's add a Piral instance. Make a new directory *app-shell* (or whatever you want to call it - we'll refer to it as *app-shell* from here on) in the *packages* directory:

```sh
mkdir packages/app-shell
npx piral new --no-install --base packages/app-shell
```

Now that we scaffolded an app shell we can modify its *package.json* (located in *packages/app-shell*). We started with:

```json
{
  "name": "app-shell",
  "version": "1.0.0",
  "description": "",
  "keywords": [
    "piral"
  ],
  "dependencies": {
    "piral": "0.13.5"
  },
  "scripts": {
    "start": "piral debug",
    "build": "piral build"
  },
  "app": "./src/index.html",
  "pilets": {
    "files": [],
    "externals": [],
    "scripts": {},
    "validators": {},
    "devDependencies": {},
    "preScaffold": "",
    "postScaffold": "",
    "preUpgrade": "",
    "postUpgrade": "",
    "packageOverrides": {}
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/react-router": "latest",
    "@types/react-router-dom": "latest",
    "piral-cli": "0.13.5",
    "typescript": "latest"
  }
}
```

and we can change it to:

```json
{
  "name": "app-shell",
  "version": "0.0.0",
  "description": "",
  "keywords": [
    "piral"
  ],
  "dependencies": {
    "piral": "0.13.5"
  },
  "scripts": {
    "start": "piral debug",
    "declaration": "piral declaration",
    "build": "piral build"
  },
  "app": "./src/index.html",
  "types": "./dist/index.d.ts",
  "pilets": {
    "files": [],
    "externals": [],
    "scripts": {},
    "validators": {},
    "devDependencies": {},
    "preScaffold": "",
    "postScaffold": "",
    "preUpgrade": "",
    "postUpgrade": "",
    "packageOverrides": {}
  },
  "devDependencies": {}
}
```

where we moved the `devDependencies` to the top-level (monorepo root) *package.json*, added a script to create the declaration ("index.d.ts") file, and referenced the file in the `types` field. We'll also need some *.gitignore* rule for omitting the `dist` folder, but let's focus on the NPM work right now.

The monorepo root *package.json* should now look close to the following:

```json
{
  "name": "monorepo-tutorial",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "postinstall": "lerna run declaration"
  },
  "license": "MIT",
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/react-router": "latest",
    "@types/react-router-dom": "latest",
    "lerna": "^3.10.7",
    "piral-cli": "^0.13.5",
    "piral-cli-webpack5": "^0.13.5",
    "typescript": "latest"
  }
}
```

We moved over the `devDependencies` and added a `postinstall` script that just runs the declaration command in each package. We also added the `piral-cli-webpack5` package, which will be required for any bundling needs, such as debugging or building the Piral instance or pilets.

::: tip: Run commands
`lerna run` is a utility to run one command (if available) in all packages. Any package that has, e.g., a `declaration` script will run it when `lerna run declaration` is triggered. This is very handy for building - only specify a `build` command in each package and now you can build all packages by using `lerna run build`.
:::

Now its time to resolve the dependencies in our monorepo. We should always use `lerna bootstrap` for this:

```sh
npx lerna bootstrap
```

If everything seems fine you can try to build your app shell for the first time:

```sh
npx lerna run build
```

This may take a while. To make the output more "interactive" you could use `--stream`, like this: `npx lerna run build --stream`. Otherwise, Lerna will only present the output when a task has completed.

Now may be a good time for your first commit. So make sure to also add a *.gitignore* file. The following content is appropriate for now, but you can (and should) anything that makes sense for your repository:

```plain
node_modules
dist
```

When adding more items to the monorepo it may make sense to follow a certain naming convention. As an example, we could suffix the pilets with `-pilet`. The exact convention is up to you - we will refer to the `-pilet` for our convention in this tutorial. Just make sure to stay consistent.

The following command creates a new pilet called `foo-pilet`:

```sh
npx pilet new app-shell --no-install --base packages/foo-pilet
```

Like beforehand, we may want to fiddle with the scaffolded *package.json*. Originally, it may look like that:

```json
{
  "name": "foo-pilet",
  "version": "1.0.0",
  "description": "",
  "keywords": [
    "pilet"
  ],
  "dependencies": {},
  "devDependencies": {
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/react-router": "latest",
    "@types/react-router-dom": "latest",
    "@types/node": "latest",
    "typescript": "latest",
    "@dbeining/react-atom": "latest",
    "@libre/atom": "latest",
    "history": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router": "latest",
    "react-router-dom": "latest",
    "tslib": "latest",
    "path-to-regexp": "latest",
    "app-shell": "1.0.0",
    "piral-cli": "^0.13.5"
  },
  "peerDependencies": {
    "@dbeining/react-atom": "*",
    "@libre/atom": "*",
    "history": "*",
    "react": "*",
    "react-dom": "*",
    "react-router": "*",
    "react-router-dom": "*",
    "tslib": "*",
    "path-to-regexp": "*",
    "app-shell": "*"
  },
  "scripts": {
    "start": "pilet debug",
    "build": "pilet build",
    "upgrade": "pilet upgrade"
  },
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "source": "src/index.tsx",
  "piral": {
    "comment": "Keep this section to use the Piral CLI.",
    "name": "app-shell"
  },
  "peerModules": []
}
```

So we could modify it to be:

```json
{
  "name": "foo-pilet",
  "version": "0.0.0",
  "description": "",
  "keywords": [
    "pilet"
  ],
  "dependencies": {},
  "devDependencies": {
    "@dbeining/react-atom": "latest",
    "@libre/atom": "latest",
    "history": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router": "latest",
    "react-router-dom": "latest",
    "tslib": "latest",
    "path-to-regexp": "latest",
    "app-shell": "0.0.0"
  },
  "peerDependencies": {
    "@dbeining/react-atom": "*",
    "@libre/atom": "*",
    "history": "*",
    "react": "*",
    "react-dom": "*",
    "react-router": "*",
    "react-router-dom": "*",
    "tslib": "*",
    "path-to-regexp": "*",
    "app-shell": "*"
  },
  "scripts": {
    "start": "pilet debug",
    "build": "pilet build",
    "upgrade": "pilet upgrade"
  },
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "source": "src/index.tsx",
  "piral": {
    "comment": "Keep this section to use the Piral CLI.",
    "name": "app-shell"
  },
  "peerModules": []
}
```

We adjusted the version number to be aligned with the other packages and removed the duplicated `devDependencies`.

With this in mind we can now add a few more convenience scripts to the monorepo root *package.json*:

```json
{
  "name": "monorepo-tutorial",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "start": "pilet debug packages/*-pilet",
    "build": "lerna run build",
    "build:shell": "lerna run build --stream --scope app-shell",
    "build:pilets": "lerna run build --scope *-pilet",
    "postinstall": "lerna run declaration"
  },
  "license": "MIT",
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/react-router": "latest",
    "@types/react-router-dom": "latest",
    "lerna": "^3.10.7",
    "piral-cli": "^0.13.5",
    "piral-cli-webpack5": "^0.13.5",
    "typescript": "latest"
  }
}
```

The `build` and `build:shell` / `build:pilets` scripts are all convenience to avoid calling `lerna run ...` all the time. With these, you could just

```sh
yarn build:pilets
```

to build all pilets. Likewise, just by calling `yarn start` you can now debug *all* your pilets at once. If you only want to debug a single one you can still do that. For instance, for *foo-pilet* you could do:

```sh
lerna run start --scope foo-pilet --stream
```

## Conclusion

Setting up a monorepo with Piral requires some additional knowledge. Nevertheless, using the right steps and keeping an eye on things such as versioning, `dependencies` and `devDependencies` it is possible to come up with a decent solution that scales really well. What we did not cover is the CI/CD aspect, which will certainly be more complex to implement correctly than in the independent repositories case.
