import * as React from 'react';
import { useOnScreenVisible } from './onScreenVisible';

jest.mock('react');

(React as any).useState = result => [result, jest.fn()];

describe('OnScreenVisible Module', () => {
  it('is not intersecting by default', () => {
    const result = useOnScreenVisible({ current: undefined });
    expect(result).toBeFalsy();
  });
});
