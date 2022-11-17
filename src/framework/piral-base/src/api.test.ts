import { initializeApi, mergeApis } from './api';

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('API Module', () => {
  it('createCoreApi pluginMeta returns the metadata', () => {
    const container = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    };
    const api = initializeApi(moduleMetadata, container);
    expect(api.meta).toEqual({
      name: moduleMetadata.name,
      version: moduleMetadata.version,
      hash: moduleMetadata.hash,
    });
  });

  it('mergeApis merges multiple APIs', () => {
    const baseApi: any = {
      a: 'foo',
    };
    const newApi = mergeApis(baseApi, [() => ({ b: 'bar' }) as any], {} as any);
    expect(newApi).toEqual({
      a: 'foo',
      b: 'bar',
    });
    expect(newApi).toBe(baseApi);
  });
});
