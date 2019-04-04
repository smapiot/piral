import * as React from 'react';
import { DefaultLoader } from './loader';
import { mount } from 'enzyme';

describe('Default Loader Component', () => {
  it('renders correctly', () => {
    const node = mount(<DefaultLoader />);
    expect(node.find('div').length).toBe(1);
  });
});
