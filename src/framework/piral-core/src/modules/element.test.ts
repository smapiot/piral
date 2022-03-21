import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

describe('Elemnts Module', () => {
  const state = Atom.of({
    portals: {},
  });
  const context = createActions(state, createListener({}));

  it('renderElement', () => {
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    element.setAttribute('name', 'foo');
    element.setAttribute('params', {});
    document.body.removeChild(element);
    renderElement(context, element, {});
    const event = new Event('extension-props-changed');
    element.dispatchEvent(event);
    const [dispose] = renderElement(context, element, {});
    dispose();
    expect(deref(state)['portals']['root'].length).toBe(1);
  });

  it('testing setters and getters in class PiralExtension', () => {
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    element.params;
    element.params = 'anything';
    expect(element.params).toEqual('anything');
    element.name = 'foo';
    expect(element.name).toEqual('foo');
    element.empty = 'anything';
    expect(element.empty).toEqual('anything');
  });
});
