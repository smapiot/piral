import { PiletApi } from 'piral-core';

export interface Mocked<T> {
  api: T;
  registry: Record<string, Array<any>>;
}

export function createPiralMockApi<T extends PiletApi>(baseObj: Partial<T> = {}): Mocked<T> {
  const registry: Mocked<T>['registry'] = {};
  const api = new Proxy(baseObj, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        if (prop.startsWith('register')) {
          const rn = prop.replace('register', '');
          registry[rn] = registry[rn] || [];
          registry[rn].push();
        } else if (prop.startsWith('unregister')) {
          const rn = prop.replace('unregister', '');
          registry[rn] = registry[rn] || [];
        }

        switch (prop) {
          case 'meta':
            return (
              baseObj.meta ?? {
                name: 'test-pilet',
                version: '0.0.0',
              }
            );
          case 'emit':
            return jest.fn();
          case 'on':
            return jest.fn();
          case 'off':
            return jest.fn();
          case 'getData':
            return jest.fn();
          case 'setData':
            return jest.fn();
          case 'Extension':
            return jest.fn();
          case 'renderHtmlExtension':
            return jest.fn();
        }
      }

      return undefined;
    },
  }) as T;

  return {
    api,
    registry,
  };
}
