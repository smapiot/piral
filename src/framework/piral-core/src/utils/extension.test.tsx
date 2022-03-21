import * as React from 'react';
import { mount } from 'enzyme';
import { reactifyContent, toExtension } from './extension';


describe('Util Extension.', () => {
  it('Convert some component to an extension component.', () => {
    const Component = (props) => <b>{props.title}</b>;
    const Extension = toExtension(Component);
    const node = mount(<Extension piral={undefined} params={{ title: 'Foo' }} />);
    expect(node.find('b').length).toBe(1);
  });

  it('reactifyContent.', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = `<div>FOO<</div>`;
    const result = reactifyContent(container.childNodes) as React.ReactElement;
    const node = await mount(result)
    expect(node.find("slot").length).toBe(1);
  });
});

