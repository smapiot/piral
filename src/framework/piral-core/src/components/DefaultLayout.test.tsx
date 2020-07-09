import * as React from 'react';
import { DefaultLayout } from './DefaultLayout';
import { mount } from 'enzyme';

describe('Default Layout Component', () => {
  it('renders correctly for desktop', () => {
    const children = <div></div>;
    const node = mount(<DefaultLayout currentLayout="desktop" children={children} />);
    expect(node.find('div').length).toBe(1);
  });

  it('renders correctly for mobile', () => {
    const children = <div></div>;
    const node = mount(<DefaultLayout currentLayout="mobile" children={children} />);
    expect(node.find('div').length).toBe(1);
  });

  it('renders correctly for tablet', () => {
    const children = <div></div>;
    const node = mount(<DefaultLayout currentLayout="tablet" children={children} />);
    expect(node.find('div').length).toBe(1);
  });
});
