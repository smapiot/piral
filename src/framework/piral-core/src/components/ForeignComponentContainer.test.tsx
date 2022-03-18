import * as React from 'react';
import { ForeignComponentContainer } from './ForeignComponentContainer';
import { Atom } from '@dbeining/react-atom';
import { mount } from 'enzyme';
import { createActions } from '../state';
import { createListener } from 'piral-base';
import { DefaultLoadingIndicator } from '../components/DefaultLoader'
import { ForeignComponent } from '../types';

describe('ForeignComponentContainer Module', () => {
    it('renders correctly for desktop', () => {
        const state = Atom.of({
            app: {},
            rounter: {}
        });
        const ctx = createActions(state, createListener({}));
        const Component = mount(<DefaultLoadingIndicator />) as ForeignComponent;
        const node = mount(<ForeignComponentContainer $portalId="123" $component={Component} $context={ctx} innerProps={ } />);
        console.log(node.debug())
        expect(node.find('ForeignComponentContainer').length).toBe(1);
        expect(node.find({ 'data-portal-id': "123" }).length).toBe(1);
    });
});
