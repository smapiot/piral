import * as React from 'react';
import { changeDomPortal, convertComponent, renderInDom } from './foreign';
import { ForeignComponent } from '../types';
import { DefaultLoadingIndicator } from '../components/DefaultLoader';

// const StubComponent: React.FC = (props) => <div />;
// StubComponent.displayName = 'StubComponent';

describe('Util Foreign.', () => {
  it('changeDomPortal changes dom in portal', () => {
    const children = React.createElement('div');
    const current: React.ReactPortal = { key: 'current', children: { children }, type: 'div', props: null };

    const context = {
      updatePortal: jest.fn(),
    } as any;
    const portalId = 'data-portal-id';
    const element = document.createElement('div') as HTMLDivElement;
    element.setAttribute(portalId, '100');

    const result = changeDomPortal(portalId, current, context, element, DefaultLoadingIndicator, {});
    expect(result).not.toEqual({});
  });

  it('Convert component function throws error due to missing converter function.', () => {
    const t = () => {
      convertComponent(null, React.createElement('div'));
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
