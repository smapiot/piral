/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { render, act } from '@testing-library/react';
import { RootListener } from './RootListener';

vitest.mock('./hooks/globalState', () => ({
  useGlobalStateContext: () => ({
    showPortal() {},
  }),
}));

function resolveAfter(time = 5) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

describe('RootListener Component', () => {
  it('renders the RootListener instance with default settings', async () => {
    const element = document.createElement('div');
    const removed = vitest.fn();
    document.body.appendChild(element);
    render(<RootListener />);
    document.body.removeEventListener = removed;
    await act(() => {
      const event = new CustomEvent('render-html', {
        bubbles: true,
        detail: {
          target: element,
          props: {},
        },
      });
      element.dispatchEvent(event);
      return resolveAfter();
    });
    await act(resolveAfter);
    expect(removed).not.toHaveBeenCalled();
  });

  it('removes the RootListener successfully', async () => {
    const removed = vitest.fn();
    const container = render(<RootListener />);
    document.body.removeEventListener = removed;
    await act(resolveAfter);
    container.unmount();
    await act(resolveAfter);
    expect(removed).toHaveBeenCalled();
  });
});
