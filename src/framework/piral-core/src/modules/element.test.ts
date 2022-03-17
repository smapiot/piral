import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

describe('Elemnts Module', () => {
  it('renderElement', () => {
    const state = Atom.of({
      portals: {},
    });
    const context = createActions(state, createListener({}));
    const element = document.createElement('div') as HTMLElement;
    renderElement(context, element, {});
    expect(deref(state)['portals']).not.toEqual({});
  });
});
