import { createGqlApi } from './create';
import { PiletGqlApi } from './types';

jest.mock('./queries', () => ({
  gqlQuery(c, q, o) {
    return Promise.resolve(o);
  },
  gqlMutation(c, q, o) {
    return Promise.resolve(o);
  },
}));

describe('create the urql API', () => {
  it('query works even though no options are supplied', async () => {
    const creator = createGqlApi('nothing' as any);
    const api = creator({
      emit() {},
      on() {},
      off() {},
      includeProvider() {},
    } as any) as PiletGqlApi;
    const result = await api.query('examples { name }');
    expect(result.headers).toEqual({});
  });

  it('query preserves the original headers', async () => {
    const creator = createGqlApi('nothing' as any);
    const api = creator({
      emit() {},
      on() {},
      off() {},
      includeProvider() {},
    } as any) as PiletGqlApi;
    const result = await api.query('examples { name }', {
      headers: {
        foo: 'bar',
      },
    });
    expect(result.headers).toEqual({ foo: 'bar' });
  });

  it('query headers can be changed via middleware', async () => {
    const creator = createGqlApi('nothing' as any);
    const api = creator({
      emit(name, e) {
        if (name === 'before-fetch') {
          e.setHeaders({
            milk: 'molk',
          });
        }
      },
      on() {},
      off() {},
      includeProvider() {},
    } as any) as PiletGqlApi;
    const result = await api.query('examples { name }', {
      headers: {
        foo: 'bar',
      },
    });
    expect(result.headers).toEqual({ foo: 'bar', milk: 'molk' });
  });

  it('mutation works even though no options are supplied', async () => {
    const creator = createGqlApi('nothing' as any);
    const api = creator({
      emit() {},
      on() {},
      off() {},
      includeProvider() {},
    } as any) as PiletGqlApi;
    const result = await api.mutate('examples { name }');
    expect(result.headers).toEqual({});
  });
});
