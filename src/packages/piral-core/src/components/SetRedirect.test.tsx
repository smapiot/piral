import * as React from 'react';
import { mount } from 'enzyme';
import { SetRedirect } from './SetRedirect';

describe('Piral-Core SetRedirect component', () => {
  it('SetRedirect sets the redirect route in the store', () => {
    const node = mount(<SetRedirect from="/foo" to="/bar" />);
  });
});
