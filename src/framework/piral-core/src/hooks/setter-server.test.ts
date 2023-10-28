/**
 * @vitest-environment node
 */

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vitest } from 'vitest';
import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', () => {
    const cb = vitest.fn();

    const MyComponent = () => {
      useSetter(cb);
      return null;
    };

    const result = renderToString(React.createElement(MyComponent));
    expect(result).toEqual('');
    expect(cb).toHaveBeenCalled();
  });
});
