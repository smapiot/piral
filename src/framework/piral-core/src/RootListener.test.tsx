import * as React from 'react';
import { render, act } from '@testing-library/react';
import { RootListener } from './RootListener';

jest.mock('./hooks/globalState', () => ({
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
    const removed = jest.fn();
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
    const removed = jest.fn();
    const container = render(<RootListener />);
    document.body.removeEventListener = removed;
    await act(resolveAfter);
    container.unmount();
    await act(resolveAfter);
    expect(removed).toHaveBeenCalled();
  });
});
