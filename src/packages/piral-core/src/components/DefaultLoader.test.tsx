import * as React from 'react';
import { DefaultLoadingIndicator } from './DefaultLoader';
import { mount } from 'enzyme';

describe('Default Loader Component', () => {
  it('renders correctly', () => {
    const node = mount(<DefaultLoadingIndicator />);
    expect(node.find('div').length).toBe(1);
  });
});
