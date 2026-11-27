---
title: Testing pilets
description: Testing pilets with Vitest — registration logic first, then the DOM.
---

# Testing pilets

There are two distinct things to test in a pilet, and they call for different styles:

1. **Registration logic** — what your `setup(api)` function registers, and under which conditions. This is plain JavaScript and has *nothing to do with any UI framework*. It's the highest-value, fastest test you can write.
2. **Rendered output** — what a component actually produces. This is about the **DOM**, so it runs in a DOM environment regardless of whether the component was authored in React, Vue, Svelte, or web components.

All examples here use [Vitest](https://vitest.dev). Nothing below is React-specific except where a concrete component is rendered — and even then the assertions are made against the DOM, so the same approach works for any framework.

## Setup

```bash
npm install --save-dev vitest
```

Configure a DOM environment so component tests have a `document` to render into:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',   // or 'happy-dom'
    globals: true,
  },
});
```

```bash
npm install --save-dev jsdom
```

## Testing `setup()` registrations

This is the part unique to Piral, and it needs no DOM and no framework at all. Give `setup` a fake Pilet API and assert what it registered. A small typed factory keeps tests readable:

```ts
import { vi } from 'vitest';
import type { PiletApi } from 'my-app-shell';

export function createMockApi(overrides: Partial<PiletApi> = {}): PiletApi {
  return {
    registerPage: vi.fn(),
    registerMenu: vi.fn(),
    registerExtension: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    getData: vi.fn(),
    setData: vi.fn(),
    meta: { name: 'test', version: '0.0.0', config: {}, basePath: '/', link: '' },
    ...overrides,
  } as unknown as PiletApi;
}
```

```ts
import { describe, it, expect } from 'vitest';
import { setup } from './index';
import { createMockApi } from './test-utils';

describe('pilet setup', () => {
  it('registers the products page and a menu item', () => {
    const api = createMockApi();

    setup(api);

    expect(api.registerPage).toHaveBeenCalledWith('/products', expect.any(Function));
    expect(api.registerMenu).toHaveBeenCalledTimes(1);
  });
});
```

Conditional registration is where this really pays off — assert that the right thing is wired up for each input:

```ts
it('only registers the admin page for admins', () => {
  const adminApi = createMockApi({ getData: vi.fn(() => ({ roles: ['admin'] })) });
  const userApi = createMockApi({ getData: vi.fn(() => ({ roles: [] })) });

  setup(adminApi);
  setup(userApi);

  expect(adminApi.registerPage).toHaveBeenCalledWith('/admin', expect.any(Function));
  expect(userApi.registerPage).not.toHaveBeenCalledWith('/admin', expect.any(Function));
});
```

If your app shell ships test helpers, you can use them instead of a hand-written mock:

```ts
import { createTestApi } from 'piral-core/test'; // api.registerPage etc. are vi.fn() mocks
```

## Testing the DOM

To test what a component renders, mount it into the jsdom `document` and assert against the resulting DOM. The example uses React, but the assertions only touch DOM nodes — swap in your framework's mount call and the rest is unchanged:

```tsx
import { describe, it, expect, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ProductCard } from './ProductCard';

let container: HTMLElement;

afterEach(() => container?.remove());

function mount(node: React.ReactNode) {
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => createRoot(container).render(node));
  return container;
}

describe('ProductCard', () => {
  it('shows the product name and price', () => {
    const el = mount(<ProductCard name="Widget Pro" price={29.99} />);

    expect(el.textContent).toContain('Widget Pro');
    expect(el.querySelector('[data-testid="price"]')?.textContent).toBe('€29.99');
  });
});
```

Prefer a higher-level helper? [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/) is framework-agnostic and pairs naturally with Vitest:

```ts
import { getByText } from '@testing-library/dom';

const el = mount(<ProductCard name="Widget Pro" price={29.99} />);
expect(getByText(el, 'Widget Pro')).toBeTruthy();
```

## Testing extension behavior

Extension components are just components that receive `params`. Render one with sample params and assert the DOM reacts correctly — for example, that a promo only appears above a threshold:

```tsx
it('shows free-shipping promo only above the threshold', () => {
  expect(mount(<PromoWidget params={{ cartTotal: 80 }} />).textContent).toContain('free shipping');
  expect(mount(<PromoWidget params={{ cartTotal: 20 }} />).textContent).toBe('');
});
```

## What to test where

Keep most of your coverage in the fast, framework-free `setup()` tests — they catch the integration mistakes (wrong route, missing menu, wrong condition) that actually break a pilet inside the shell. Use DOM tests for the rendering details that matter, and lean on the [emulator](/concepts/emulator) for true end-to-end checks against the real shell.
