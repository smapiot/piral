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

## Using NPM Aliases

(tbd)

## Defining a Version Selector

(tbd)

## Conclusion

In this tutorial you've seen different strategies to mitigate issues that may appear when you want to share multiple versions of the same dependency. Clearly, the best way forward is to rely on the implicit sharing of dependencies between your pilets. As seen, Piral allows you to move forward in various ways making it possible to find the right solution for your problem.
