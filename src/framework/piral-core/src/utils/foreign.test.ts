import { createElement } from 'react';
import { convertComponent, renderInDom } from './foreign';
import { ForeignComponent } from '../types';
import { DefaultLoadingIndicator } from '../components/DefaultLoader';

describe('Util Foreign.', () => {
  it('Convert component function throws error due to missing converter function.', () => {
    const t = () => {
      convertComponent(null, createElement('div'));
    };
    expect(t).toThrow('No converter for component of type "div" registered.');
  });

  it('Convert component function returns converted component.', () => {
    const fComponent: ForeignComponent<any> = {
      mount: () => {},
    };
    const result = convertComponent(() => {
      return fComponent;
    }, createElement('div'));
    expect(result).toEqual(fComponent);
  });

  it('Render in DOM', () => {
    const context = {
      showPortal: jest.fn(),
    } as any;
    const portalId = 'data-portal-id';
    const element = document.createElement('div') as HTMLDivElement;
    element.setAttribute(portalId, '100');
    var [result] = renderInDom(context, element, DefaultLoadingIndicator, {});
    expect(result).toBe('100');
  });

  it('Render in DOM with parent node missing', () => {
    const context = {
      showPortal: jest.fn(),
    } as any;
    const element = document.createElement('div') as HTMLDivElement;
    var [result] = renderInDom(context, element, DefaultLoadingIndicator, {});
    expect(result).toBe('root');
  });
});
