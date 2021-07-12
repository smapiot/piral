import { createElement } from 'react';
import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { changeLayout, includeProvider } from './app';
import { createActions } from '../state';
import { mount } from 'enzyme';

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
