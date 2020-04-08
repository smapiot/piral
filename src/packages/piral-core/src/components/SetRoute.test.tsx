import * as React from 'react';
import { mount } from 'enzyme';
import { SetRoute } from './SetRoute';

const FakeRoute = () => null;
FakeRoute.displayName = 'FakeRoute';

describe('Piral-Core SetRoute component', () => {
  it('SetRoute sets the link route in the store', () => {
    const node = mount(<SetRoute path="/foo" component={FakeRoute} />);
  });
});
