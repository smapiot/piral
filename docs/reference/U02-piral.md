---
title: Upgrading Piral Instances
description: What needs to be done to upgrade Piral instances with newer versions of Piral.
section: Upgrade
---

# Upgrading Piral Instances

Piral instances will contain multiple touch points to Piral:

1. The `piral-cli`, i.e., the tooling
2. The used core libraries (e.g., `piral-base`, `piral-core`, or `piral`)
3. Any additional plugins (e.g., `piral-oidc`, `piral-dashboard`, or `piral-ng`)

When you run `piral upgrade` the `piral-cli` will take care of updating the used Piral references.

The upgrade process of a Piral instance does:

1. Gets the current state of the Piral instance
2. Updates all Piral-related packages specified in `devDependencies` and `dependencies`
3. Installs the updated dependencies incl. an updated `piral-cli`

The mechanism compares the associated repositories of the packages starting with `piral` to the repository field from the `piral-cli` package. Only in case of an alignment, the update is performed.
