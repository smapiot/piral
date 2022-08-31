---
title: Upgrading Pilets
description: What needs to be done to upgrade pilets with newer app shell versions.
section: Upgrade
---

# Upgrading Pilets

Pilets have two common touch points to Piral:

1. Directly via the `piral-cli`, i.e., the tooling
2. Indirectly via the referenced Piral instances

Additionally, some plugins (e.g., converters such as `piral-ng`) might be used in pilets. In general, however, the Piral libraries (e.g., `piral-core`), as well as Piral plugins (e.g., `piral-dashboard`) should **not** be consumed in pilets.

When you run `pilet upgrade` the `piral-cli` will take care of updating the app shell reference to a specified version (or `latest` if none was specified) and - in addition - aligning the used version of the `piral-cli`. Therefore, it will do all the hard work of updating the app shell reference.

In addition, there might be multiple app shells installed. The `pilet upgrade` command will try to update all *selected* app shells.

An app shell is selected if

- there is no *pilet.json*, but instead a `piral` section in the *package.json* mentioning the app shell by its name
- it's the only app shell mentioned in *pilet.json* `piralInstances` property
- no app shell has a property `selected: true` in the *pilet.json*
- it was assigned the `selected: true` property

The `piralInstances` might be used to determined what *can* be loaded and what *should* be loaded as an app shell.

The upgrade process of a pilet does (this is run for each selected app shell):

1. Gets the current state of the pilet
2. Installs the new version of the app shell
3. Runs the `preUpgrade` script determined by the app shell
4. Gets the current scaffold data (snapshot)
5. Applies the updated scaffold data (increment to snapshot)
6. Patches the *package.json* and *pilet.json* of the pilet
7. Installs the (updated) dependencies - incl. a potentially updated `piral-cli`
8. Runs the `postUpgrade` script determined by the app shell
