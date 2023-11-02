import { describe, it, expect, vitest } from 'vitest';
import { useSharedData } from './sharedData';

vitest.mock('./globalState', () => ({
  useGlobalState(select) {
    return select({
      data: {
        a: 'foo',
        b: 'bar',
      },
    });
  },
}));

describe('SharedData Module', () => {
  it('selects the corresponding value', () => {
    const a = useSharedData((m) => m.a);
    expect(a).toBe('foo');
  });

  it('selects the non-available value', () => {
    const c = useSharedData((m) => m.c);
    expect(c).toBe(undefined);
  });

  it('selects the full shared data object', () => {
    const dict = useSharedData();
    expect(dict).toEqual({
      a: 'foo',
      b: 'bar',
    });
  });
});
