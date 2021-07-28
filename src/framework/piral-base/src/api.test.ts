import { initializeApi } from './api';

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
});
