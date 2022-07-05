import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
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
    const container = document.body.appendChild(document.createElement('div'));
    render(<RootListener />, container);
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
    const container = document.body.appendChild(document.createElement('div'));
    const removed = jest.fn();
    render(<RootListener />, container);
    document.body.removeEventListener = removed;
    await act(resolveAfter);
    render(<div />, container);
    await act(resolveAfter);
    expect(removed).toHaveBeenCalled();
  });
});
