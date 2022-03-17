/**
 * @jest-environment node
 */

import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('In this test window typeof should be undefinde', () => {
    expect(typeof window).toBe('undefined');
    const fun = () => {
      return;
    };
    useSetter(fun);
  });
});
