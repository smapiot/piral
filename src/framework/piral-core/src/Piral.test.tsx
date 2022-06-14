import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { Piral } from './Piral';
import { RegisteredRouter } from './components';
import { createInstance } from './createInstance';

function resolveAfter(time = 5) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 5) {
  await act(resolveAfter);
  wrapper.update();
}

describe('Piral Component', () => {
  it('renders the Piral instance with default settings', async () => {
    const node = mount(<Piral />);
    await waitForComponentToPaint(node);
    expect(node.find(RegisteredRouter).length).toBe(1);
  });

  it('renders the Piral instance with custom settings', async () => {
    const instance = createInstance();
    const node = mount(<Piral instance={instance} />);
    await waitForComponentToPaint(node);
    expect(node.find(RegisteredRouter).length).toBe(1);
  });
});
