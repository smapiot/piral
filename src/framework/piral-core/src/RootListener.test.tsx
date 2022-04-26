import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { RootListener } from './RootListener';

jest.mock('./hooks/globalState', () => ({
  useGlobalStateContext: () => ({
    showPortal() {},
  }),
}));

describe('RootListener Component', () => {
  it('renders the RootListener instance with default settings', async () => {
    const element = document.createElement('div');
    const removed = jest.fn();
    document.body.appendChild(element);
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);
    root.render(<RootListener />);
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
      return Promise.resolve();
    });
    await act(() => Promise.resolve());
    expect(removed).not.toHaveBeenCalled();
  });

  it('removes the RootListener successfully', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const removed = jest.fn();
    const root = createRoot(container);
    root.render(<RootListener />);
    document.body.removeEventListener = removed;
    await act(() => Promise.resolve());
    root.unmount();
    await act(() => Promise.resolve());
    expect(removed).toHaveBeenCalled();
  });
});
