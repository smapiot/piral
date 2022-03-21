import * as React from 'react';
import { mount } from 'enzyme';
import { RootListener } from './RootListener';

describe('RootListener Component', () => {
    it('renders the RootListener instance with default settings', async () => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        const node = await mount(<RootListener />);
        const event = new Event('render-html');
        element.dispatchEvent(event);
        expect(node.find(RootListener).length).toBe(1);
    });
});
