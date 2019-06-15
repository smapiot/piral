import * as queue from './queue';
import * as bootstrap from './bootstrap';
import { ngPage, ngTile, ngMenu, ngExtension, ngModal } from './register';

jest.mock('./queue', () => ({
  enqueue(cb) {
    cb();
  },
}));

jest.mock('./bootstrap', () => ({
  bootstrap: jest.fn(),
}));

describe('register', () => {
  it('successfully registers a page', () => {
    const registrations: Record<string, string> = {};
    const portalMock = {
      registerPageX(route, fn) {
        registrations[route] = fn;
      },
    };

    ngPage(portalMock as any, 'foo', {}, '/bar');

    expect(Object.keys(registrations)).toEqual(['/bar']);
    expect(typeof registrations['/bar']).toBe('function');
  });

  it('successfully registers a tile', () => {
    const registrations: Record<string, string> = {};
    const portalMock = {
      registerTileX(name, fn) {
        registrations[name] = fn;
      },
    };

    ngTile(portalMock as any, 'foo', {});

    expect(Object.keys(registrations)).toEqual(['foo']);
    expect(typeof registrations.foo).toBe('function');
  });

  it('successfully registers a menu item', () => {
    const registrations: Record<string, string> = {};
    const portalMock = {
      registerMenuX(name, fn) {
        registrations[name] = fn;
      },
    };

    ngMenu(portalMock as any, 'foo', {});

    expect(Object.keys(registrations)).toEqual(['foo']);
    expect(typeof registrations.foo).toBe('function');
  });

  it('successfully registers an extension', () => {
    const registrations: Record<string, string> = {};
    const portalMock = {
      registerExtensionX(slot, fn) {
        registrations[slot] = fn;
      },
    };

    ngExtension(portalMock as any, 'foo', {}, 'slot_foo');

    expect(Object.keys(registrations)).toEqual(['slot_foo']);
    expect(typeof registrations.slot_foo).toBe('function');
  });

  it('successfully registers a modal dialog', () => {
    const registrations: Record<string, string> = {};
    const portalMock = {
      registerModalX(name, fn) {
        registrations[name] = fn;
      },
    };

    ngModal(portalMock as any, 'foo', {});

    expect(Object.keys(registrations)).toEqual(['foo']);
    expect(typeof registrations.foo).toBe('function');
  });

  it('uses a new page component', () => {
    const node = {} as HTMLElement;
    const portalMock = {
      registerPageX(_, fn) {
        fn(node, {}, {});
      },
    };

    ngPage(portalMock as any, 'foo', {}, '/bar');
    expect(node.id).toBe('foo');
  });

  it('uses a new tile component', () => {
    const node = {} as HTMLElement;
    const portalMock = {
      registerTileX(_, fn) {
        fn(node, {}, {});
      },
    };

    ngTile(portalMock as any, 'foo', {});
  });

  it('uses a new menu item component', () => {
    const node = {} as HTMLElement;
    const portalMock = {
      registerMenuX(_, fn) {
        fn(node, {}, {});
      },
    };

    ngMenu(portalMock as any, 'foo', {});
    expect(node.id).toBe('foo');
  });

  it('uses a new extension component', () => {
    const node = {} as HTMLElement;
    const portalMock = {
      registerExtensionX(_, fn) {
        fn(node, {}, {});
      },
    };

    ngExtension(portalMock as any, 'foo', {}, 'slot_foo');
    expect(node.id).toBe('foo');
  });

  it('uses a new modal component', () => {
    const node = {} as HTMLElement;
    const portalMock = {
      registerModalX(_, fn) {
        fn(node, {}, {});
      },
    };

    ngModal(portalMock as any, 'foo', {});
    expect(node.id).toBe('foo');
  });
});
