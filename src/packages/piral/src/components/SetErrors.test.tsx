import * as React from 'react';
import { mount } from 'enzyme';
import { SetErrors } from './SetErrors';

const FakeError = () => null;
FakeError.displayName = 'FakeError';

describe('Piral SetErrors component', () => {
  it('SetErrors sets the error components', () => {
    const node = mount(<SetErrors errors={{
      menu: FakeError,
    }} />);
  });
});
