# Introduction

Piral is a solution for frontend modularization, where the different modules can be developed independently without any binding to the host system. We call these modules *pilets*. We therefore refer to a pilet as a small module that lives inside a piral instance. Piral gives you a set of tools for developing your application using microfrontends.

While the idea of smaller (independent) modules is not new the provided approach has some advantages (and - depending on the use-case - disadvantages) over, e.g., bundle splitting as its done in modern build systems. Actually, the given approach is not exclusive and can be used together with bundle splitting.

A pilet is not only independent of the main application (a "piral instance"), but also independently developed. This means we can give an independent development team the task to build a module in our application without requiring the same repository or infrastructure.

<div class="responsive-container">
<iframe allowFullScreen="allowFullScreen" src="https://www.youtube.com/embed/SkKvpBHy_5I?ecver=1&amp;iv_load_policy=1&amp;yt:stretch=16:9&amp;autohide=1&amp;color=red&amp;width=560&amp;width=560" width="560" height="315" allowtransparency="true" frameborder="0"></iframe>
</div>

The introduction video is available on [YouTube](https://youtu.be/SkKvpBHy_5I).

## Your First Piral Application

Piral offers us many choices to help us creating an outstanding portal-like application. There are, however, two main choices to get us off the ground:

1. Start with `piral` following only specifications and standard patterns
2. Implement everything on our own with help of `piral-core`

We will look at both ways. For simplicity, we start with 1. to have a working application in no time.

### A Standard Piral Application

The main boost for implementing an application based on `piral` comes from the fact that `piral` can be considered a framework. All the choices are already made for us, e.g., how the application renders or which version of React is used.

Let's start with an empty folder / project somewhere:

```sh
mkdir my-piral && cd my-piral
npm init -y
```

Let's install `piral` (and we are done with the dependencies!):

```sh
npm i piral
```

This is it! Really? Well, we have not built, customized, or published this instance yet. Ideally, we use the `piral-cli` to do most of these tasks very efficiently without much configuration needs.

We should always add the CLI as a *local* **dev** dependency.

```sh
npm i piral-cli --save-dev
```

To help us see the commands in action we can also use a *global* version of the CLI. Make sure to have it installed via `npm i piral-cli -g`.

### A Piral-Core Based Application

Here, we will rely on `piral-core`, which can be considered a library. While very special dependencies such as `react-arbiter` are straight dependencies, common dependencies such as `react` are only peer referenced. This leaves many of the open choices up to the developer providing greater freedom.
