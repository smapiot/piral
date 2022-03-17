import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { RootListener } from './RootListener';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, amount));
        wrapper.update();
    });
}

describe('Piral Component', () => {
    it('renders the Piral instance with default settings', async () => {
        const node = mount(<RootListener />);
        await waitForComponentToPaint(node);
        console.log(node.debug());
    });
});
