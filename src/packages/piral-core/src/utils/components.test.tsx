import * as React from 'react';
import { convertComponent } from './components';
import { ComponentConverters, HtmlComponent } from '../types';

describe('Component Converters Module', () => {
  it('React FC is correctly marked', () => {
    const Component = () => <div />;
    const converters: ComponentConverters<any> = {
      html() {
        return undefined;
      },
    };
    const result = convertComponent(converters, Component, 'test');
    expect(result).toHaveProperty('displayName', 'test');
    expect(result).not.toHaveProperty('converted');
  });

  it('React class component is correctly marked', () => {
    const Component = class extends React.Component {
      render() {
        return <div />;
      }
    };
    const converters: ComponentConverters<any> = {
      html() {
        return undefined;
      },
    };
    const result = convertComponent(converters, Component, 'test');
    expect(result).toHaveProperty('displayName', 'test');
    expect(result).not.toHaveProperty('converted');
  });

  it('React exotic component is correctly marked', () => {
    const Component = React.lazy(() =>
      Promise.resolve().then(() => ({
        default: () => <div />,
      })),
    );
    const converters: ComponentConverters<any> = {
      html() {
        return undefined;
      },
    };
    const result = convertComponent(converters, Component, 'test');
    expect(result).toHaveProperty('displayName', 'test');
    expect(result).not.toHaveProperty('converted');
  });

  it('HTML component is correctly marked', () => {
    const Component: HtmlComponent<any> = {
      type: 'html',
      render() {
        return undefined;
      },
    };
    const converters: ComponentConverters<any> = {
      html(): any {
        return {
          converted: true,
        };
      },
    };
    const result = convertComponent(converters, Component, 'test');
    expect(result).not.toHaveProperty('displayName');
    expect(result).toHaveProperty('converted', true);
  });

  it('Unknown component throws', () => {
    const Component = {
      type: 'foo',
    };
    const converters: ComponentConverters<any> = {
      html() {
        return undefined;
      },
    };
    expect(() => convertComponent(converters, Component as any, 'test')).toThrow();
  });
});
