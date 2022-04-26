import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', async () => {
    const cb = jest.fn();

    const MyComponent = () => {
      useSetter(cb);
      return null;
    };

    const root = createRoot(document.body.appendChild(document.createElement('div')));
    root.render(React.createElement(MyComponent));
    await act(() => Promise.resolve());
    expect(cb).toHaveBeenCalled();
  });
});
