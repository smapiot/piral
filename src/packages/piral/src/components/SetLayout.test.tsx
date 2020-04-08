import * as React from 'react';
import { mount } from 'enzyme';
import { SetLayout } from './SetLayout';

const FakeContainer = () => null;
FakeContainer.displayName = 'FakeContainer';

describe('Piral SetLayout component', () => {
  it('SetLayout sets the layout components', () => {
    const node = mount(<SetLayout layout={{
      DashboardContainer: FakeContainer,
    }} />);
  });
});
