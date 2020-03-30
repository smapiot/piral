# Instructions for Migration

Starting with the release of 0.11 we encourage everyone to read this before migrating.

> In general we will never break your Pilet API. Therefore, all of these changes below refer to the use of the Piral CLI for non-essential tasks or your Piral instance.

## 0.10 to 0.11

**Breaking Changes in 0.11**

1. The `PiletApi` now originates from piral-base
2. In pilets externals are now part of the root object in their package.json, no longer in piral
3. Pilets are build by default using the `v1` schema (this can be changed via a command line flag `--schema`)

**How to handle**

### 1) PiletApi

Well, this is a pretty simple one. If you - for some reason - extended the `PiletApi` directly (i.e., not via the `PiletCustomApi` interface that comes from `piral-core`) then you'd need to change your `declare module` path.

```ts
declare module 'piral-base/lib/types' {
  interface PiletApi {}
}
```

But then again - in most cases you will not need to do anything.

### 2) Externals

The handling of externals was always split in two parts:

1. Definition of the shared dependencies in the `externals` key of the `pilets` section within the *package.json* of the Piral instance.
2. The `peerDependencies` in `externals` keys in the *package.json* of the pilets. The latter key is part of the `piral` section.

The second part was now changed. `externals` are no longer copied from the app shell to the pilet. Instead, only the `peerDependencies` are used.

Since it is the classic behavior anyway to copy the externals to the `peerDependencies`, too, in most cases you'll not need to do anything here, too.

In any other case upon `pilet upgrade` this is corrected / aligned anyway. There is also no functional consequence here that forces you to update and rebuild.

### 3) Pilet Schema

With 0.11 the interpretation of pilets changed. For backwards compatibility the old mode is still present and triggered if the feed service metadata does not contain a `requireRef` key per pilet.

The whole mechanism has been build such that the new way is used when:

- the Piral instance uses 0.11 or more recent
- the feed service knows about the pilet `v1` schema
- the pilet has been build using the Piral CLI 0.11 or more recent with the `v1` schema (which is the default schema)

We recommend using the new mode. If you want to use it, you'll need to upgrade your Piral instance to 0.11 or later. You'll also need to use a compatible feed service (the official one is updated, as well as our sample feed service). Finally, all pilets that should use `v1` must be re-build using a 0.11 version of the `piral-cli`.
