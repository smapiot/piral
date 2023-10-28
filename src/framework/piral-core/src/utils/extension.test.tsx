/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { reactifyContent, toExtension } from './extension';

describe('Util Extension.', () => {
  it('Convert some component to an extension component.', () => {
    const Component = ({ title }) => <b>{title}</b>;
    const piral: any = {};
    const Extension = toExtension(Component) as any;
    const node = render(<Extension piral={piral} params={{ title: 'Foo' }} />);
    expect(node.container.querySelectorAll('b').length).toBe(1);
  });

  it('reactifyContent.', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = `<div>FOO<</div>`;
    const result = reactifyContent(container.childNodes) as React.ReactElement;
    const node = render(result);
    expect(node.container.querySelectorAll('piral-slot').length).toBe(1);
  });
});
