// import * as React from 'react';
// import { Atom, deref } from '@dbeining/react-atom';
// import { mount } from 'enzyme';
// import { ForeignComponentContainer } from './ForeignComponentContainer';
// import { createActions } from '../state';
// import { createListener } from 'piral-base';
// import { PiralRoutes } from "./PiralRoutes"

// describe('Extension Module', () => {
//     it('is able to default render not available extension', () => {
//         const state = Atom.of({});
//         const ctx = createActions(state, createListener({}));
//         const node = mount(<ForeignComponentContainer $portalId="qxz" $component="component" $context={ctx} innerProps={ } />);
//         expect(node.at(0).exists()).toBe(true);
//     });

//     it('is able to default render not available extension 2', () => {
//         const state = Atom.of({});
//         const ctx = createActions(state, createListener({}));
//         const component = PiralRoutes
//         const node = mount(<ForeignComponentContainer $portalId="qxz" $component={component} $context={ctx} innerProps={ } />);
//         expect(node.at(0).exists()).toBe(true);
//     });
// });
