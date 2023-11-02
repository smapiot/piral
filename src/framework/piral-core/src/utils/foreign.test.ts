/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { changeDomPortal, convertComponent, renderInDom } from './foreign';
import { DefaultLoadingIndicator } from '../defaults/DefaultLoadingIndicator';
import { ForeignComponent } from '../types';

describe('Util Foreign.', () => {
  it('changeDomPortal changes dom in portal', () => {
    const children = React.createElement('div');
    const current: React.ReactPortal = { key: 'current', children: { children } as any, type: 'div', props: null };

    const context = {
      updatePortal: vitest.fn(),
    } as any;
    const portalId = 'pid';
    const element = document.createElement('piral-portal') as HTMLElement;
    element.setAttribute(portalId, '100');

    const result = changeDomPortal(portalId, current, context, element, DefaultLoadingIndicator, {});
    expect(result).not.toEqual({});
  });

  it('Convert component function throws error due to missing converter function.', () => {
    const t = () => {
      convertComponent(null as any, React.createElement('div'));
    };
    expect(t).toThrow('No converter for component of type "div" registered.');
  });

  it('Convert component function returns converted component.', () => {
    const fComponent: ForeignComponent<any> = {
      mount: () => {},
    };
    const result = convertComponent(() => {
      return fComponent;
    }, React.createElement('div'));
    expect(result).toEqual(fComponent);
  });

  it('Render in DOM', () => {
    const context = {
      showPortal: vitest.fn(),
    } as any;
    const portalId = 'pid';
    const element = document.createElement('piral-portal') as HTMLElement;
    element.setAttribute(portalId, '100');
    var [result] = renderInDom(context, element, DefaultLoadingIndicator, {});
    expect(result).toBe('100');
  });

  it('Render in DOM with parent node missing', () => {
    const context = {
      showPortal: vitest.fn(),
    } as any;
    const element = document.createElement('piral-portal') as HTMLElement;
    var [result] = renderInDom(context, element, DefaultLoadingIndicator, {});
    expect(result).toBe('root');
  });
});
