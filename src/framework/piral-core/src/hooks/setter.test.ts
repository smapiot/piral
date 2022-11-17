import * as React from 'react';
import { render, act } from '@testing-library/react';
import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', async () => {
    const cb = jest.fn();

    const MyComponent = () => {
      useSetter(cb);
      return null;
    };

    render(React.createElement(MyComponent));
    await act(() => new Promise((resolve) => setTimeout(resolve, 5)));
    expect(cb).toHaveBeenCalled();
  });
});
