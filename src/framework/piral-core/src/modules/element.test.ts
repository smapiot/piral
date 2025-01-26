/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

vitest.mock('../../app.codegen', () => ({
  applyStyle: vitest.fn((element) => {
    element.style.display = 'contents';
  }),
  createNavigation: vitest.fn((publicPath) => ({
    publicPath,
  })),
  publicPath: '/',
}));

function createMockContext(): [any, any] {
  const state: any = create(() => ({
    portals: {},
  }));
  const context = createActions(state, createListener({}));
  return [context, state];
}

describe('Elements Module', () => {
  it('testing basic renderElement functionality of piral-extension web component', () => {
    const [context, state] = createMockContext();
    const element = document.createElement('piral-extension');
    const event = new Event('extension-props-changed');
    document.body.appendChild(element);
    renderElement(context, element, {});
    element.dispatchEvent(event);
    document.body.removeChild(element);
    (element as any).connectedCallback();
    expect(state.getState().portals.root.length).toBe(1);
  });

  it('disposing piral-extension web component', () => {
    const [context, state] = createMockContext();
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    const [dispose] = renderElement(context, element, {});
    expect(state.getState().portals.root.length).toBe(1);
    dispose();
    expect(state.getState().portals.root.length).toBe(0);
  });

  it('testing setters and getters in piral-extension web component', () => {
    const [context] = createMockContext();
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    renderElement(context, element, {});
    expect(element.params).toEqual(null);
    expect(element.name).toEqual(null);
    expect(element.empty).toEqual(undefined);
    element.params = 'anything';
    element.name = 'foo';
    element.empty = 'anything';
    expect(element.params).toEqual('anything');
    expect(element.name).toEqual('foo');
    expect(element.empty).toEqual('anything');
    element.setAttribute('name', 'bar');
    element.setAttribute('params', '{}');
    expect(element.params).toEqual({});
    expect(element.name).toEqual('bar');
  });

  it('testing attributes of piral-extension web component', () => {
    const [context] = createMockContext();
    const element = document.createElement('piral-extension');
    document.body.appendChild(element);
    renderElement(context, element, {});
    element.setAttribute('name', 'bar');
    element.setAttribute('params', '{}');
    expect(element.params).toEqual({});
    expect(element.name).toEqual('bar');
  });
});
