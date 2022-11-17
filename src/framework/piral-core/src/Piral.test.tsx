import * as React from 'react';
import { render, act } from '@testing-library/react';
import { Piral } from './Piral';
import { createInstance } from './createInstance';

describe('Piral Component', () => {
  it('renders the Piral instance with default settings', async () => {
    const node = render(<Piral />);
    await act(() => Promise.resolve());
    expect(node.container.childNodes.length).toBe(1);
  });

  it('renders the Piral instance with custom settings', async () => {
    const instance = createInstance();
    const node = render(<Piral instance={instance} />);
    await act(() => Promise.resolve());
    expect(node.container.childNodes.length).toBe(1);
  });
});
