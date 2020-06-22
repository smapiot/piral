import * as React from 'react';
import { mount } from 'enzyme';
import { Modals } from './Modals';
import { PiralModalsHost } from './components';

const state = {
  registry: {
    modals: {},
  },
  modals: [],
};

jest.mock('piral-core', () => ({
  useGlobalState(cb: any) {
    return cb(state);
  },
  getPiralComponent() {
    return ({ children }) => <div>{children}</div>;
  },
}));

describe('Modals Component Shell Module', () => {
  it('Should display nothing is nothing is there', () => {
    state.registry.modals = {};
    state.modals = [];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(false);
  });

  it('Should display something if something is there and wanted', () => {
    state.registry.modals = {
      foo: {
        component: () => <div />,
      },
    };
    state.modals = [
      {
        name: 'foo',
        options: {},
      },
    ];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(true);
  });

  it('Should display nothing if something is there and not wanted', () => {
    state.registry.modals = {
      foo: {
        component: () => <div />,
      },
    };
    state.modals = [];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(false);
  });

  it('Should display something if something is there and wanted even indirectly', () => {
    state.registry.modals = {
      'abc:foo': {
        component: () => <div />,
        name: 'bar',
      },
    };
    state.modals = [
      {
        name: 'xyz:foo',
        alternative: 'bar',
        options: {},
      },
    ];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(true);
  });

  it('Should display nothing is something is there and not wanted with indirection', () => {
    state.registry.modals = {
      'abc:foo': {
        component: () => <div />,
        name: 'qxz',
      },
    };
    state.modals = [
      {
        name: 'xyz:foo',
        alternative: 'bar',
        options: {},
      },
    ];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(false);
  });

  it('Should display nothing if nothing is available even if wanted', () => {
    state.registry.modals = {};
    state.modals = [
      {
        name: 'foo',
        options: {},
      },
    ];
    const node = mount(<Modals />);
    expect(node.find(PiralModalsHost).prop('open')).toBe(false);
  });

  it('Should close all available dialogs', () => {
    const close = jest.fn();
    state.registry.modals = {};
    state.modals = [
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
    const node = mount(<Modals />);
    const closeAll = node.find(PiralModalsHost).prop('close');
    expect(typeof closeAll).toBe('function');
    expect(close).toHaveBeenCalledTimes(0);
    closeAll();
    expect(close).toHaveBeenCalledTimes(2);
  });
});
