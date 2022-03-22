/**
 * @jest-environment node
 */

import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

function createMockContext(): [any, any] {
  const state = Atom.of({
    portals: {
      root: [],
    },
  });
  const context = createActions(state, createListener({}));
  return [context, state];
}

describe('Elements Module from SSR', () => {
  it('Should not have piral-extensions web component', () => {
    const [context, state] = createMockContext();
    const element: any = {
      addEventListener() {},
    };
    renderElement(context, element, {});
    expect(deref(state)['portals']['root'].length).toBe(0);
  });
});
