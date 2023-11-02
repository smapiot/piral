/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Modals } from './Modals';

let registeredModals: Record<string, any> = {};
let openModals: Array<any> = [];

vitest.mock('piral-core', () => ({
  getPiralComponent(name) {
    switch (name) {
      case 'ModalsHost':
        return ({ open, children, close }) => (
          <div role="host">
            {open && (
              <div role="overlay">
                <button role="close" onClick={close}>
                  Close
                </button>
                {children}
              </div>
            )}
          </div>
        );
      case 'ModalsDialog':
        return ({ children }) => <>{children}</>;
      default:
        return null;
    }
  },
  useGlobalState(select) {
    return select({
      registry: {
        modals: registeredModals,
      },
      modals: openModals,
    });
  },
}));

describe('Modals Component Shell Module', () => {
  afterEach(() => {
    cleanup();
  });

  it('Should display nothing is nothing is there', () => {
    registeredModals = {};
    openModals = [];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display something if something is there and wanted', () => {
    registeredModals = {
      foo: {
        component: () => <div />,
      },
    };
    openModals = [
      {
        name: 'foo',
        options: {},
      },
    ];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).not.toBe(null);
  });

  it('Should display nothing if something is there and not wanted', () => {
    registeredModals = {
      foo: {
        component: () => <div />,
      },
    };
    openModals = [];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display something if something is there and wanted even indirectly', () => {
    registeredModals = {
      'abc:foo': {
        component: () => <div />,
        name: 'bar',
      },
    };
    openModals = [
      {
        name: 'xyz:foo',
        alternative: 'bar',
        options: {},
      },
    ];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).not.toBe(null);
  });

  it('Should display nothing is something is there and not wanted with indirection', () => {
    registeredModals = {
      'abc:foo': {
        component: () => <div />,
        name: 'qxz',
      },
    };
    openModals = [
      {
        name: 'xyz:foo',
        alternative: 'bar',
        options: {},
      },
    ];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display nothing if nothing is available even if wanted', () => {
    registeredModals = {};
    openModals = [
      {
        name: 'foo',
        options: {},
      },
    ];
    const node = render(<Modals />);
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should close all available dialogs', () => {
    const close = vitest.fn();
    registeredModals = {
      foo: {
        component: () => <div />,
      },
      bar: {
        component: () => <div />,
      },
    };
    openModals = [
      {
        name: 'foo',
        options: {},
        close,
      },
      {
        name: 'bar',
        options: {},
        close,
      },
    ];
    const node = render(<Modals />);
    expect(close).toHaveBeenCalledTimes(0);
    fireEvent.click(node.getByRole('close'));
    expect(close).toHaveBeenCalledTimes(2);
  });
});
