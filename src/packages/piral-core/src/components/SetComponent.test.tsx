import * as React from 'react';
import { mount } from 'enzyme';
import { SetComponent } from './SetComponent';

const FakeLoading = () => null;
FakeLoading.displayName = 'FakeLoading';

describe('Piral-Core SetComponent component', () => {
  it('SetComponent sets the layout component in the store', () => {
    const node = mount(<SetComponent name="LoadingIndicator" component={FakeLoading} />);
  });
});
