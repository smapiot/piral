import * as React from 'react';
import { mount } from 'enzyme';
import { toExtension } from './extension';

describe('Util Extension.', () => {
  it('Convert some component to an extension component.', () => {
    const Component = (props) => <b>{props.title}</b>;
    const Extension = toExtension(Component);
    const node = mount(<Extension piral={undefined} params={{ title: 'Foo' }} />);
    expect(node.find('b').length).toBe(1);
  });
});
