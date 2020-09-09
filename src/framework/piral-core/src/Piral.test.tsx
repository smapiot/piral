import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { Piral } from './Piral';
import { PiralRouter } from './components';
import { createInstance } from './createInstance';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, amount));
    wrapper.update();
  });
}

describe('Piral Component', () => {
  it('renders the Piral instance with default settings', async () => {
    const node = mount(<Piral />);
    await waitForComponentToPaint(node);
    expect(node.find(PiralRouter).length).toBe(1);
  });

  it('renders the Piral instance with custom settings', async () => {
    const instance = createInstance();
    const node = mount(<Piral instance={instance} />);
    await waitForComponentToPaint(node);
    expect(node.find(PiralRouter).length).toBe(1);
  });
});
