import { createElement } from 'react';
import { Atom, deref } from '@dbeining/react-atom';
import { createListener, Pilet, PiletEntry } from 'piral-base';
import {
  changeLayout,
  includeProvider,
  initialize,
  injectPilet,
  removePilet,
  setComponent,
  setErrorComponent,
  setRoute,
} from './app';
import { createActions } from '../state';
import { mount } from 'enzyme';
import { RootListener } from '../RootListener';

const pilet: Pilet = {
  name: 'my-pilet',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
};

describe('App Actions Module', () => {
  it('changeLayout changes the current layout', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        layout: 'tablet',
      },
    });
    const ctx = createActions(state, createListener({}));
    changeLayout(ctx, 'mobile');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        layout: 'mobile',
      },
    });
  });

  it('initialize initializes state data', () => {
    const state = Atom.of({
      app: {},
    });
    const ctx = createActions(state, createListener({}));
    const modules = ['pilet 1', 'pilet 2', 'pilet 3'];
    initialize(ctx, false, undefined, modules);
    expect(deref(state)).toEqual({
      app: { error: undefined, loading: false },
      modules: ['pilet 1', 'pilet 2', 'pilet 3'],
    });
  });

  it('removePilet removes pilet', () => {
    const state = Atom.of({
      app: {},
      modules: [pilet],
      registry: { 'my-pilet': pilet },
    });
    const ctx = createActions(state, createListener({}));
    removePilet(ctx, 'my-pilet');
    expect(deref(state)).toEqual({ app: {}, modules: [], registry: { 'my-pilet': pilet } });
  });

  it('injectPilet injects pilet', () => {
    const pilet2: Pilet = {
      name: 'my-pilet2',
      version: '1.0.0',
      link: undefined,
      custom: undefined,
    };
    const state = Atom.of({
      app: {},
      modules: [pilet2],
      registry: { pilet2 },
    });
    const ctx = createActions(state, createListener({}));
    injectPilet(ctx, pilet);
    expect(deref(state)).toEqual({ app: {}, modules: [pilet2, pilet], registry: { pilet2 } });
  });

  it('setComponent set component', () => {
    const state = Atom.of({
      components: {},
    });
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setComponent(ctx, 'ComponentName', node);
    expect(deref(state)).toEqual({ components: { ComponentName: RootListener } });
  });

  it('setErrorComponent set error component', () => {
    const state = Atom.of({
      errorComponents: {},
    });
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setErrorComponent(ctx, 'ComponentName', node);
    expect(deref(state)).toEqual({ errorComponents: { ComponentName: RootListener } });
  });

  it('setRoute sets route', () => {
    const state = Atom.of({
      routes: {},
    });
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setRoute(ctx, './dist', RootListener);
    expect(deref(state)).toEqual({ routes: { './dist': RootListener } });
  });

  it('allows using includeProvider once', () => {
    const state = Atom.of({
      provider: undefined,
    });
    const Provider = (props) => createElement('div', props);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider));

    const NewProvider = deref(state).provider;
    expect(NewProvider).not.toBeUndefined();

    const node = mount(createElement(NewProvider, undefined, 'Some text'));
    expect(node.find('div').length).toBe(1);
    expect(node.text()).toBe('Some text');
  });

  it('allows using includeProvider twice', () => {
    const state = Atom.of({
      provider: undefined,
    });
    const Provider1 = (props) => createElement('i', props);
    const Provider2 = (props) => createElement('b', props);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider1));
    includeProvider(ctx, createElement(Provider2));

    const NewProvider = deref(state).provider;
    expect(NewProvider).not.toBeUndefined();

    const node = mount(createElement(NewProvider, undefined, 'Some text'));
    expect(node.find('b').length).toBe(1);
    expect(node.find('i').length).toBe(1);
    expect(node.text()).toBe('Some text');
  });

  it('allows using includeProvider with props', () => {
    const state = Atom.of({
      provider: undefined,
    });
    const Provider = (props) => createElement('i', props, props.text, props.children);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider, { text: 'Icecream' }));

    const NewProvider = deref(state).provider;
    expect(NewProvider).not.toBeUndefined();

    const node = mount(createElement(NewProvider, undefined, 'Some text'));
    expect(node.find('b').length).toBe(0);
    expect(node.find('i').length).toBe(1);
    expect(node.text()).toBe('IcecreamSome text');
  });

  it('allows multiple includeProvider with props', () => {
    const state = Atom.of({
      provider: undefined,
    });
    const Provider1 = (props) => createElement('i', props, props.text, props.children);
    const Provider2 = (props) => createElement('b', props, props.text, props.children);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider1, { text: 'Icecream' }));
    includeProvider(ctx, createElement(Provider2, { text: 'Chocolate' }));

    const NewProvider = deref(state).provider;
    expect(NewProvider).not.toBeUndefined();

    const node = mount(createElement(NewProvider, undefined, 'Some text'));
    expect(node.find('b').length).toBe(1);
    expect(node.find('i').length).toBe(1);
    expect(node.text()).toBe('IcecreamChocolateSome text');
  });
});
