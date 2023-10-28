/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DefaultLoadingIndicator } from './DefaultLoadingIndicator';

describe('Default Loading Indicator Component', () => {
  it('renders correctly', () => {
    const node = render(<DefaultLoadingIndicator />);
    expect(node.container.querySelectorAll('div').length).toBe(1);
  });
});
