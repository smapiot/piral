import { defaultApiExtender, defaultModuleRequester, getExtender } from './helpers';

describe('Helper Module', () => {
  it('defaultApiExtender is identity function', () => {
    const original = {};
    const result = defaultApiExtender(original as any);
    expect(result).toBe(original);
  });

  it('defaultModuleRequester returns an empty array', async () => {
    const result = await defaultModuleRequester();
    expect(result).toEqual([]);
  });

  it('getExtender works with an empty array', () => {
    const ext = getExtender([]);
    const original = {};
    const result = ext(original as any);
    expect(result).toBe(original);
  });

  it('getExtender removes non-functions', () => {
    const ext = getExtender(['foo' as any]);
    const original = {};
    const result = ext(original as any);
    expect(result).toBe(original);
  });

  it('getExtender applies single function', () => {
    const ext = getExtender([
      c => ({
        ...c,
        b: 7,
      }),
    ]);
    const original = {
      a: 5,
    };
    const result = ext(original as any);
    expect(result).toEqual({
      a: 5,
      b: 7,
    });
  });

  it('getExtender applies multiple functions', () => {
    const ext = getExtender([
      c => ({
        ...c,
        b: 7,
      }),
      c => ({
        ...c,
        b: 10,
      }),
    ]);
    const original = {
      a: 5,
    };
    const result = ext(original as any);
    expect(result).toEqual({
      a: 5,
      b: 10,
    });
  });
});
