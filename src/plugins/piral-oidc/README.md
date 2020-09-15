[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral OIDC](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-oidc.svg?style=flat)](https://www.npmjs.com/package/piral-oidc) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-oidc` brings to the table is a direct integration with OpenID Connect identity providers on basis of the oidc-client library that can be used with `piral` or `piral-core`.

The set includes the `getAccessToken` API to retrieve the current user's access token, as well as `getProfile` to retrieve the current user's open id claims.

By default, these Pilet API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `getAccessToken()`

Gets a promise for the currently authenticated user's token or `undefined` if no user is authenticated.

### `getProfile()`

Gets a promise for the currently authenticated user's open id claims. Rejects if the user is expired or not authenticated.

## Usage

::: summary: For pilet authors

You can use the `getAccessToken` function from the Pilet API. This returns a promise.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export async function setup(piral: PiletApi) {
  const userToken = await piral.getAccessToken();
  // do something with userToken
}
```

Note that this value may change if the Piral instance supports an "on the fly" login (i.e., a login without redirect / reloading of the page).

If you need to use claims from the authentication:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export async function setup(piral: PiletApi) {
    const userClaims = await piral.getProfile();
    // consume profile / claims information
}
```

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createOidcApi` from the `piral-oidc` package.

*Custom claims* are supported by declaration merging. Reference the `types` module in typescript and
merge into the PiralCustomOidcProfile.

```ts
import { createOidcApi } from 'piral-oidc';
```

The integration looks like:

```ts
import { createOidcApi, setupOidcClient } from 'piral-oidc';

// These should match what your server provides
declare module "piral-oidc/lib/types" {
    interface PiralCustomOidcProfile {
        companies: Array<string>;
        organizations: Array<string>;
    }
}

const client = setupOidcClient({ clientId, ... });

const instance = createInstance({
  // important part
  plugins: [createOidcApi(client)],
  // ...
});
```

The separation into `setupOidcClient` and `createOidcApi` was done to simplify the standard usage.

Normally, you would want to have different modules here. As an example consider the following code:

```ts
// module oidc.ts
import { setupOidcClient } from 'piral-oidc';

export const client = setupOidcClient({ ... });

// app.ts
import { createOidcApi } from 'piral-oidc';
import { client } from './oidc';

export function render() {
  renderInstance({
    // ...
    plugins: [createOidcApi(client)],
  });
}

// index.ts
import { client } from './oidc';

if (location.pathname !== '/auth') {
  client.token()
    .then(() => { import('./app').then(({ render }) => render()); })
    .catch(reason => {
      // You may want to log your failed authentication attempts
      // console.error(reason);
      client.login();
    });
}
```

This way we evaluate the current path and act accordingly. Note that the actually used path may be different for your application.

### Built-in authentication flow

A convenience method named `handleAuthentication()` was added to the `oidcClient` to
handle callbacks and routing for you. In order to use this, add a `appUrl` to the
client configuration that points to your entry-point route, and then call `handleAuthentication()` in your index file.

`handleAuthentication()` will return a promise that resolves to an `AuthenticationResult`
When `result.isAuthenticated` is true, the application should call `render()`, when false, do nothing (this is a silent renew happening in the background).

If the promise rejects, it is advised that the error is logged to an external logging service, as this indicates a user that could not gain entry into the application. Afterwards, call `logout()` or prompt the user for the next action.

```ts
// module oidc.ts
import { setupOidcClient } from 'piral-oidc';

export const client = setupOidcClient({
    appUrl: location.origin + '/app',
    redirectUrl: location.origin + '/auth',
    postLogoutUrl: location.origin + '/logout'
});

// app.ts
import { createOidcApi } from 'piral-oidc';
import { client } from './oidc';

export function render() {
  renderInstance({
    // ...
    plugins: [createOidcApi(client)],
  });
}

// index.ts
import { client } from './oidc';
import { loggingService } from './your/logging/service';

client.handleAuthentication()
    .then(async ({ isAuthenticated }) => {
        if (isAuthenticated) {
            const render = await import('./app');
            render();
        }
    })
    .catch(async (err) => {
        await loggingService.fatal(err);
        client.logout();
    })
```

### Retaining state between sign in request and the callback
You can pass the `setupOidcClient` function `signInRedirectParams` which will be passed
to the signInRedirect method.

After properly signing in, the `state` param will be available when the callback method is finally
reached. This can be used to do things such as redirecting to an originally visited URL that
can no longer be referenced due to jumping between your app and the auth pages.

```ts
// module oidc.ts
import { setupOidcClient } from 'piral-oidc';

declare module 'piral-oidc/lib/types' {
  // this interface determines the state type on the redirect params
  interface PiralCustomRedirectState {
    finalRedirectUri: string;
  }
}

export const client = setupOidcClient({
  redirectUrl: location.origin + '/auth',
  postLogoutUrl: location.origin + '/logout',
  signInRedirectParams: {
    state: {
      finalRedirectUri: location.href
    }
  }
});

// index.ts
import { client } from './oidc';

client.handleAuthentication()
  .then(async ({ isAuthenticated, state }) => {
    if (state?.finalRedirectUri) {
      location.href = state.finalRedirectUri;
    } else if (isAuthenticated) {
      const render = await import('./app');
      render();
    }
  });
```


:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
