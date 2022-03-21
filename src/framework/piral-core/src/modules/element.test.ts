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
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    element.params;
    element.params = 'anything';
    element.name;
    element.name = 'foo';
    element.empty;
    element.empty = {};
    element.disconnectedCallback();
    element.attributeChangedCallback('name', 'boo');
    element.attributeChangedCallback('params', 'foo');
    const [dispose] = renderElement(context, element, {});
    const event = new Event('extension-props-changed');
    element.dispatchEvent(event);
    dispose();
    expect(deref(state)['portals']).not.toEqual({});
  });
});
