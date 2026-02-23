[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Hooks Utils](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-hooks-utils.svg?style=flat)](https://www.npmjs.com/package/piral-hooks-utils) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Community Chat](https://img.shields.io/discord/1222632475449229352)](https://discord.gg/kKJ2FZmK8t)

A set of hooks and HOCs for pilets and Piral instances.

## Installation

This should only be installed as a dependency (`dependencies`) as it is only designed mostly for runtime/consumption by Piral or pilets. You could also share it explicitly or implicitly from your Piral instance if you'd like to optimize usage in your pilets. It's not required though as the code provided by it is minimal and tree-shakable.

If you'd love to use yarn:

```sh
yarn add piral-hooks-utils
```

Alternatively, npm works reliably, too:

```sh
npm i --save piral-hooks-utils
```

## Included Hooks

The following hooks are included.

### `useAfterVisible`

A hook to indicate something was suddenly visible.

### `useAsyncReplace`

Gives a full async lifecycle in a hook.

### `useLockBodyScroll`

Hook that locks scrolling on the main document.

### `useOnClickOutside`

Hook that detects if a click outside the given reference has been performed.

### `useOnScreenVisible`

Hook that detects if a reference element within the main document is visible.

### `usePiletApi`

Retrieves the Pilet API stored in the provider.

### `usePrompt`

Hook to notify the user in case of potential data loss when performing a page transition (internal or external).

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
