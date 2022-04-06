import * as React from 'react';
import { DefaultLoadingIndicator } from './DefaultLoadingIndicator';
import { mount } from 'enzyme';

describe('Default Loading Indicator Component', () => {
  it('renders correctly', () => {
    const node = mount(<DefaultLoadingIndicator />);
    expect(node.find('div').length).toBe(1);
  });
});
