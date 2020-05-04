---
title: Authentication
description: How to use authentication with Piral.
audience: Architects, Developers
level: Intermediate
---

# Authentication

Authentication is a crucial feature of most real-world applications. Even though the authentication itself and consequently any implied authorization needs to come from the backend, we see multiple points in the frontend where authentication and authorization are strongly demanded.

In Piral we focus on two aspects regarding authentication:

1. Allow intercepting network requests to inject required tokens or other relevant authentication information
2. Transport current user information to all pilets

The two aspects can be implemented very easily, however, for convenience we've also published plugins that can deal with them easily.

## Setup without Plugins

Piral is nothing more than a plain React application. Thus it can be adjusted and used like a standard React application. This allows Piral to leverage any existing JavaScript library for the integration of authentication.

Let's see an example using Microsoft's popular MSAL library.

In our app entry point we define a lazy loading app schema that is sensitive to `/auth`:

```jsx
// index.tsx
import * as React from 'react';
import { render } from 'react-dom';
import { account } from './auth';

if (location.pathname !== '/auth') {
  const App = React.lazy(() => import('./App'));
  const Landing = React.lazy(() => import('./Landing'));
  const Content = account() ? App : Landing;

  render(
    <React.Suspense fallback={<div>Loading</div>}>
      <Content />
    </React.Suspense>,
    document.querySelector('#app'),
  );
}
```

The idea is simple. The `auth` module is always loaded and first checks if we are actually using the "silent" `/auth` route. If so, we do not need to load the full app, we just have to get back the token. Otherwise, we can start the full app.

The `auth.ts` module looks as follows.

```ts
// auth.ts
import { UserAgentApplication } from 'msal';

const msalInstance = new UserAgentApplication({
  auth: {
    clientId: 'my-client-id',
    redirectUri: `${location.origin}/auth`,
  },
});

msalInstance.handleRedirectCallback(() => {});

export function getToken() {
  if (msalInstance.getAccount()) {
    return msalInstance
      .acquireTokenSilent(tokenRequest)
      .then(response => response.accessToken)
      .catch(err => {
        if (err.name === 'InteractionRequiredAuthError') {
          return msalInstance
            .acquireTokenPopup(tokenRequest)
            .then(response => response.accessToken)
            .catch(err => Promise.reject(err && err.message));
        }

        console.error(err);
        return Promise.reject('Could not fetch token');
      });
  }

  return Promise.reject('Not logged in');
}

export function account() {
  return msalInstance.getAccount();
}

export function login() {
  msalInstance.loginRedirect(tokenRequest);
}

export function logout() {
  msalInstance.logout();
}
```

All we do here is to expose functionality of the MSAL library. The rest of the application (e.g., `App.tsx` or `Landing.tsx`) are standard React components with or without Piral.

Other parts of the application can now use the `auth` module for obtaining user information. One example would be `fetch.ts`, which is used by all API calls.

```ts
// fetch.ts
import { getToken } from './auth';

export function getTokenHeader() {
  return getToken().then(token => `Bearer ${token}`);
}

export function fetchWithToken(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (!headers.has('content-type')) {
    headers.append('content-type', 'application/json');
  }

  return getTokenHeader().then(header => {
    headers.append('Authorization', header);
    return fetch(url, {
      ...init,
      headers,
    });
  });
}
```

Before actually fetching anything we first need to obtain the token. The function `fetchWithToken` would be used instead of a standard `fetch` when an authenticated call using a token needs to be performed.

How does a plugin help us here?

## Setup with a Plugin

Piral comes with some opt-in plugins that deal with user authentication. For example, the MSAL library used above could be replaced by `piral-adal`.

The essential flow would be the same. The app entry point does not change. Instead, our module `auth.ts` would change to:

```jsx
// auth.ts
import { setupAdalClient } from 'piral-adal';

export const client = setupAdalClient({
  clientId: 'my-client-id',
  redirectUri: `${location.origin}/auth`,
});

export function account() {
  return client.account();
}
```

Likewise, we could either change the `fetchWithToken` function in the `fetch.ts` module, or leverage that the Piral HTTP calls in `piral-fetch` are automatically using the token. This is also valid for `piral-axios`, `piral-urql`, and other network request plugins. They are already prepared for this.

The plugin is, however, more than just a fancy wrapper of the MSAL capabilities. It also brings an additional pilet API.

Let's see how our Piral entry point (e.g., `App.tsx`) could be changed:

```jsx
// App.tsx
import * as React from 'react';
import { createInstance, Piral, SetError, SetComponent } from 'piral';
import { createAdalApi } from 'piral-adal';
import { client } from './auth';
import { requestPilets } from './api';
import { Layout } from './layout/UserLayout';

const NotFound = React.lazy(() => import('./pages/NotFound'));

const instance = createInstance({
  extendApi: [createAdalApi(client)],
  requestPilets,
});

export default () => (
  <Piral instance={instance}>
    <SetComponent name="Layout" component={Layout} />
    <SetError type="not_found" component={NotFound} />
  </Piral>
);
```

All we need to do is to create an additional API - in this case the ADAL API via `createAdalApi`. The API creator requires an ADAL client for this. We need to use the client that was already instantiated in the `auth.ts` module.

Doing this gives all pilets a new API to access: `getAccessToken`. This gets a `Promise` that is being resolved with the current access token.

This allows any pilet to make authenticated API requests - even if no plugin such as `piral-fetch` is available.

## User Information

So far we've seen that using a plugin such as `piral-adal`, `piral-oidc`, or others makes sense to reduce boilerplate code and obtain a nice additional Pilet API function.

Sometimes, however, we already want digested user information. Here, Piral struggles to provide a generic solution that "just works". Piral cannot possibly know how your backend or user structure looks like. Instead, Piral assumes that this information is provided somehow.

`piral-auth` is an optional plugin that solves exactly that. What this plugin adds to the Pilet API is a `geUser` function. The information returned from this function is set in the Piral instance.

Usually, the user information is set already when creating the Piral instance:

```jsx
// App.tsx
import * as React from 'react';
import { createInstance, Piral, SetError, SetComponent } from 'piral';
import { createAdalApi } from 'piral-adal';
import { createAuthApi } from 'piral-auth';
import { client } from './auth';
import { requestPilets } from './api';
import { Layout } from './layout/UserLayout';

const NotFound = React.lazy(() => import('./pages/NotFound'));
const account = client.account();

const instance = createInstance({
  extendApi: [createAdalApi(client), createAuthApi({
    user: {
      id: account.userName,
      firstName: account.name.split(' ').shift(),
      lastName: account.name.split(' ').pop(),
    },
  })],
  requestPilets,
});

export default () => (
  <Piral instance={instance}>
    <SetComponent name="Layout" component={Layout} />
    <SetError type="not_found" component={NotFound} />
  </Piral>
);
```

In scenarios where the user information changes during the lifetime of the application an action can be used. The `setUser` action makes this possible. If `undefined` is supplied then a "logout" is essentially communicated (i.e., no user available). Otherwise, just call `context.setUser` to update the user information:

```jsx
// App.tsx
// ...

const instance = createInstance({
  extendApi: [createAdalApi(client), createAuthApi()],
  requestPilets,
});

// later
instance.context.setUser({
  id: account.userName,
  firstName: account.name.split(' ').shift(),
  lastName: account.name.split(' ').pop(),
});
```

By default, the `createAuthApi` call starts with no user.

## Conclusion

Realizing authentication in Piral works exactly the same as in any other React or JS web app. The enhanced possibilities of providing HTTP middleware or a strongly typed API for the pilets can be leveraged quite easily.

Piral makes it quite easy to integrate any desired authentication flow in your app.

In the next tutorial we'll have a look on how to migrate existing server-based websites to be fully delivered in pilets.
