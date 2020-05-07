---
title: Migration of SSR Applications
description: Discusses options for migration of existing websites.
audience: Architects, Developers
level: Proficient
---

# Migration of SSR Applications

Many applications have been already written and do not play well with the concept of microfrontends out of the box. Luckily, different migration options exist. While SPA are quite straightforward to migrate, classical multiple page applications can be a challenge.

In this tutorial we'll cover some of these options and show their required effort, as well as where the excel and what they don't cover.

## Available Options

There are at least three options (excl. their variations) for a smooth migration of multi page applications:

1. Leave as-is and include as `<iframe>` on demand
2. Modify and transport as fragment, which are included with `innerHTML` and `fetch`
3. Convert using a frontend UI library like React

Naturally, for each option more effort is required.

## Using iframes

A really simply integration can be done by just placing an `<iframe>` with a proper `src`.

The following snippet shows the essential idea:

```jsx
export function setup(app) {
  app.registerPage('/sample', () => <iframe src="https://example.com/my-legacy-page" />);
}
```

The major problems with this approach come for instance with the styling. Not only does the `iframe` container need to be embedded properly, its content may also require some adjustments to look consistent. If the content of the embedded page contains conflicting parts (e.g., a navigation bar) that should not be there the problem is pretty much not directly solvable.

On the other hand anything referenced like a JavaScript or a stylesheet just work as expected. There is no need to refine how interactions work.

There are also solutions that try to make `<iframe>` fairly easy to use. One example here is [zoid](https://github.com/krakenjs/zoid).

**Advantages**:

- Nothing needs to be changed on the backend
- All dynamic parts are still functional

**Downsides**:

- Links do not work as expected (may only change the iframe content)
- May not fit from a design POV (e.g., if coming with full nav, ...)

## Using HTML Fragments

In most cases starting with the use of HTML fragments is the optimum solution before going for a full migration. The backend may not be touched here, too, even though some changes could be desired.

The idea boils down to the following:

```jsx
export function setup(app) {
  const connectLegacyPage = app.createConnector(() => fetch('https://example.com/my-legacy-page').then(res => res.text()));

  app.registerPage('/sample', connectLegacyPage(({ data }) => <div dangerouslySetInnerHTML={{ __html: data }} />));
}
```

We lazy load the page's HTML content via `fetch`. In the example code we use the `createConnector` API from the [piral-feeds](https://www.npmjs.com/package/piral-feeds) plugin. This gives us a nice higher-order component plus the correct lazy loading behavior out of the box.

To enable this CORS must be allowed. Additionally, it would be great if we would not receive the full HTML (i.e., something that also contains `<html>`, `<head>`, and `<body>`), but rather just the content fragment (e.g., `<div>my content...</div>`). There are techniques to reduce the retrieved data to the content fragment in the other case, too. Likewise, supporting both - full page rendering and a content fragment response - on the server is also possible. Here, our suggestion is to send a custom header for the latter case or to be sensitive to standard CORS headers.

Even with CORS active you may not be happy at this point. There are two main reasons:

1. The page is rather static. If something only worked by using some JavaScript it is now broken.
2. The fragment may depend on some CSS style that is not there.

For the first point there are techniques that may help. Of course, we can get the inserted `<script>` elements and re-add them explicitly (instead of the `innerHTML` way, which is used implicitly above). Alternatively, we "re-program" / port them in JS already. The latter is preferred in an ongoing migration, while the former is better in workaround scenarios, where the backend may still change.

The second point can be solved similarly. Best case, the stylesheet is just referenced. For instance,

```js
import './style.scss';

export function setup(app) {
  // ...
}
```

may use the following *style.scss*:

```css
@import url('https://example.com/legacy.css');

/* my styles for the pilet */
```

Alternatively, the style can be copied, too.

**Advantages**:

- Only few changes (if any) required on the backend
- Seems to be fitting in nicely

**Downsides**:

- Works mostly for static sites without JavaScript
- May need additional resources (e.g., CSS) to work

## Using React

Finally, we have to mention that all the views may be converted to React right away. Obviously, this is the most work, even though essentials (e.g., using angle bracket notation) are still the same.

The most time consuming part here will be to change the server-side from returning HTML to returning another data format such as JSON. Best case scenario is that the server-side framework already uses a view engine based on something like MVC. In this case we already have models available, which may be suitable for being serialized to JSON.

Returning a JSON serialization of the models instead of raw HTML (i.e., the rendered models) helps tremendously when migrating. It may not feel like proper REST, but it will surely be done much faster than spending weeks or months on a proper API design.

**Advantages**:

- Best user experience
- Leverages Piral fully

**Downsides**:

- Most effort
- Needs to touch backend / service code (should serve, e.g., JSON)

## Conclusion

There are multiple options for the migration of existing applications. Our recommendation is to start with the simplest and continue with more advanced techniques when its necessary.

In the next tutorial we look at how an existing React application can be migrated efficiently to a modular frontend project.
