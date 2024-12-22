/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { createListener, Pilet } from 'piral-base';
import {
  includeProvider,
  initialize,
  injectPilet,
  removePilet,
  setComponent,
  setErrorComponent,
  setRoute,
} from './app';
import { createActions } from '../state';
import { RootListener } from '../RootListener';

vitest.mock('../../app.codegen', () => ({
  createNavigation: vitest.fn((publicPath) => ({
    publicPath,
  })),
  fillDependencies: vitest.fn(),
  publicPath: '/',
}));

const pilet: Pilet = {
  name: 'my-pilet',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
};

describe('App Actions Module', () => {
  it('initialize initializes state data', () => {
    const state: any = create(() => ({
      app: {},
    }));
    const ctx = createActions(state, createListener({}));
    const modules: any = ['pilet 1', 'pilet 2', 'pilet 3'];
    initialize(ctx, false, undefined, modules);
    expect(state.getState()).toEqual({
      app: { error: undefined, loading: false },
      modules: ['pilet 1', 'pilet 2', 'pilet 3'],
    });
  });

  it('removePilet removes pilet', () => {
    const state: any = create(() => ({
      app: {},
      modules: [pilet],
      registry: { 'my-pilet': pilet },
    }));
    const ctx = createActions(state, createListener({}));
    removePilet(ctx, 'my-pilet');
    expect(state.getState()).toEqual({ app: {}, modules: [], registry: { 'my-pilet': pilet } });
  });

  it('injectPilet injects pilet', () => {
    const pilet2: Pilet = {
      name: 'my-pilet2',
      version: '1.0.0',
      link: undefined,
      custom: undefined,
    };
    const state: any = create(() => ({
      app: {},
      modules: [pilet2],
      registry: { pilet2 },
    }));
    const ctx = createActions(state, createListener({}));
    injectPilet(ctx, pilet);
    expect(state.getState()).toEqual({ app: {}, modules: [pilet2, pilet], registry: { pilet2 } });
  });

  it('setComponent set component', () => {
    const state: any = create(() => ({
      components: {},
    }));
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setComponent(ctx, 'ComponentName', node);
    expect(state.getState()).toEqual({ components: { ComponentName: RootListener } });
  });

  it('setErrorComponent set error component', () => {
    const state: any = create(() => ({
      errorComponents: {},
    }));
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setErrorComponent(ctx, 'ComponentName', node);
    expect(state.getState()).toEqual({ errorComponents: { ComponentName: RootListener } });
  });

  it('setRoute sets route', () => {
    const state: any = create(() => ({
      routes: {},
    }));
    const ctx = createActions(state, createListener({}));
    const node = RootListener;
    setRoute(ctx, './dist', RootListener);
    expect(state.getState()).toEqual({ routes: { './dist': RootListener } });
  });

  it('allows using includeProvider once', () => {
    const state: any = create(() => ({
      provider: undefined,
    }));
    const Provider = (props) => createElement('div', props);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider));

    const NewProvider = state.getState().provider;
    expect(NewProvider).not.toBeUndefined();

    const node = render(createElement(NewProvider, undefined, 'Some text'));
    expect(node.container.querySelectorAll('div').length).toBe(1);
    expect(node.container.textContent).toBe('Some text');
  });

  it('allows using includeProvider twice', () => {
    const state: any = create(() => ({
      provider: undefined,
    }));
    const Provider1 = (props) => createElement('i', props);
    const Provider2 = (props) => createElement('b', props);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider1));
    includeProvider(ctx, createElement(Provider2));

    const NewProvider = state.getState().provider;
    expect(NewProvider).not.toBeUndefined();

    const node = render(createElement(NewProvider, undefined, 'Some text'));
    expect(node.container.querySelectorAll('b').length).toBe(1);
    expect(node.container.querySelectorAll('i').length).toBe(1);
    expect(node.container.textContent).toBe('Some text');
  });

  it('allows using includeProvider with props', () => {
    const state: any = create(() => ({
      provider: undefined,
    }));
    const Provider = (props) => createElement('i', props, props.text, props.children);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider, { text: 'Icecream' }));

    const NewProvider = state.getState().provider;
    expect(NewProvider).not.toBeUndefined();

    const node = render(createElement(NewProvider, undefined, 'Some text'));
    expect(node.container.querySelectorAll('b').length).toBe(0);
    expect(node.container.querySelectorAll('i').length).toBe(1);
    expect(node.container.textContent).toBe('IcecreamSome text');
  });

  it('allows multiple includeProvider with props', () => {
    const state: any = create(() => ({
      provider: undefined,
    }));
    const Provider1 = (props) => createElement('i', props, props.text, props.children);
    const Provider2 = (props) => createElement('b', props, props.text, props.children);
    const ctx = createActions(state, createListener({}));
    includeProvider(ctx, createElement(Provider1, { text: 'Icecream' }));
    includeProvider(ctx, createElement(Provider2, { text: 'Chocolate' }));

    const NewProvider = state.getState().provider;
    expect(NewProvider).not.toBeUndefined();

    const node = render(createElement(NewProvider, undefined, 'Some text'));
    expect(node.container.querySelectorAll('b').length).toBe(1);
    expect(node.container.querySelectorAll('i').length).toBe(1);
    expect(node.container.textContent).toBe('IcecreamChocolateSome text');
  });
});
