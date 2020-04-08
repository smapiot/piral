import * as React from 'react';
import { mount } from 'enzyme';
import { SetError } from './SetError';

const FakeError = () => null;
FakeError.displayName = 'FakeError';

describe('Piral-Core SetError component', () => {
  it('SetError sets the error component in the store', () => {
    const node = mount(<SetError type="loading" component={FakeError} />);
  });
});
