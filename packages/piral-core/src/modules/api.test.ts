import { createApi } from './api';

const moduleMetadata = {
  dependencies: {},
  name: 'my-module',
  version: '1.0.0',
  hash: '123',
};

describe('API Module', () => {
  it('createApi', () => {
    const container = {
      availableModules: [] as any,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      context: undefined as any,
      extendApi(api) {
        return api;
      },
      getDependencies: undefined as any,
      requestModules: undefined as any,
    };
    const api = createApi(moduleMetadata, container);

  });
});
