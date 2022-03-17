import * as React from 'react';
import { ForeignComponentContainer } from './ForeignComponentContainer';
import { Atom } from '@dbeining/react-atom';
import { mount } from 'enzyme';
import { createActions } from '../state';
import { createListener } from 'piral-base';

const MyComponent = ({ name }) => (
    <div>{name}</div>
);

describe('ForeignComponentContainer Module', () => {
    it('renders correctly for desktop', () => {
        const state = Atom.of({
            app: {},
            rounter: {}
        });
        const ctx = createActions(state, createListener({}));
        const node = mount(<ForeignComponentContainer $portalId="123" $component={MyComponent} $context={ctx} innerProps={name = "Test"} />);
        expect(node.find('div').length).toBe(1);
    });
});
