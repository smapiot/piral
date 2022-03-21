import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', async () => {
    const cb = jest.fn();

    const MyComponent = () => {
      useSetter(cb);
      return null;
    };

    render(React.createElement(MyComponent), document.body.appendChild(document.createElement('div')));
    await act(() => Promise.resolve());
    expect(cb).toHaveBeenCalled();
  });
});
