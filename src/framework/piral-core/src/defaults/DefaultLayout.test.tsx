/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DefaultLayout } from './DefaultLayout';

describe('Default Layout Component', () => {
  it('renders correctly for desktop', () => {
    const children = <div></div>;
    const node = render(<DefaultLayout currentLayout="desktop" children={children} />);
    expect(node.container.querySelectorAll('div').length).toBe(1);
  });

  it('renders correctly for mobile', () => {
    const children = <div></div>;
    const node = render(<DefaultLayout currentLayout="mobile" children={children} />);
    expect(node.container.querySelectorAll('div').length).toBe(1);
  });

  it('renders correctly for tablet', () => {
    const children = <div></div>;
    const node = render(<DefaultLayout currentLayout="tablet" children={children} />);
    expect(node.container.querySelectorAll('div').length).toBe(1);
  });
});
