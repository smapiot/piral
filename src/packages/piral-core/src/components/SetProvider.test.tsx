import * as React from 'react';
import { mount } from 'enzyme';
import { SetProvider } from './SetProvider';

const FakeProvider = () => null;
FakeProvider.displayName = 'FakeProvider';

describe('Piral-Core SetProvider component', () => {
  it('SetProvider uses the includeProvider action', () => {
    const node = mount(<SetProvider provider={<FakeProvider />} />);
  });
});
