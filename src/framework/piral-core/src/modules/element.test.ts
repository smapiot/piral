import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

describe('Elements Module', () => {
  const state = Atom.of({
    portals: {},
  });
  const context = createActions(state, createListener({}));

  it('testing basic renderElement functionality of piral-extension web component', () => {
    const element = document.createElement('piral-extension');
    const event = new Event('extension-props-changed');
    document.body.appendChild(element);
    renderElement(context, element, {});
    element.setAttribute('name', 'foo');
    element.setAttribute('params', {});
    element.dispatchEvent(event);
    renderElement(context, element, {});
    document.body.removeChild(element);
    expect(deref(state)['portals']['root'].length).toBe(1);
  });

  it('disposing piral-extension web component', () => {
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    renderElement(context, element, {});
    const [dispose] = renderElement(context, element, {});
    dispose();
    expect(deref(state)['portals']['root'].length).toBe(1);
  });

  it('testing setters and getters in piral-extension web component', () => {
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    expect(element.params).toEqual({});
    expect(element.name).toEqual(undefined);
    expect(element.empty).toEqual(undefined);
    element.params = 'anything';
    element.name = 'foo';
    element.empty = 'anything';
    expect(element.params).toEqual('anything');
    expect(element.name).toEqual('foo');
    expect(element.empty).toEqual('anything');
  });
});
