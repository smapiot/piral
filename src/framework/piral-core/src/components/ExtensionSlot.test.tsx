import * as React from 'react';
import { mount } from 'enzyme';
import { ExtensionSlot } from './ExtensionSlot';

jest.mock('../hooks/globalState', () => ({
  useGlobalState: (select: any) => select(state),
  useGlobalStateContext: () => ({
    converters: {
      html: ({ component }) => component,
    },
    apis: {
      _: {
        meta: {
          name: 'PiletName',
        },
      },
    },
  }),
}));

(React as any).useMemo = (cb) => cb();

const StubComponent1: React.FC = (props) => <div children={props.children} />;
StubComponent1.displayName = 'StubComponent1';

const StubComponent2: React.FC = (props) => <div children={props.children} />;
StubComponent2.displayName = 'StubComponent2';

const StubComponent3: React.FC = (props) => <div children={props.children} />;

const state = {
  portals: {},
  registry: {
    extensions: {
      foo: [],
      bar: [
        {
          component: StubComponent1,
        },
        {
          component: StubComponent1,
        },
        {
          component: StubComponent2,
        },
      ],
      bla: [
        {
          component: StubComponent3,
        },
      ],
      lol: [
        {
          component: StubComponent1,
        },
      ],
    },
  },
};

describe('Extension Module', () => {
  it('is able to default render not available extension with no name', () => {
    const node = mount(<ExtensionSlot />);
    expect(node.at(0).exists()).toBe(true);
    expect(node.find(StubComponent1).length).toBe(0);
    expect(node.find('div').length).toBe(0);
  });

  it('is able to default render given component with no name', () => {
    const component = {
      type: 'html',
      component: {
        mount(element) {
          const container = document.createElement('div');
          container.textContent = 'Hello!';
          element.appendChild(container);
        },
      },
    };
    const node = mount(<ExtensionSlot params={{ component }} />);
    expect(node.at(0).exists()).toBe(true);
    expect(node.find(StubComponent1).length).toBe(0);
    expect(node.find('div').length).toBe(1);
    expect(node.text()).toContain('Hello!');
  });

  it('is able to default render not available extension', () => {
    const node = mount(<ExtensionSlot name="qxz" />);
    expect(node.at(0).exists()).toBe(true);
    expect(node.find(StubComponent1).length).toBe(0);
  });

  it('is able to (default) render empty extension', () => {
    const node = mount(<ExtensionSlot name="foo" />);
    expect(node.at(0).exists()).toBe(true);
    expect(node.find(StubComponent1).length).toBe(0);
  });

  it('is able to custom render not available extension', () => {
    const node = mount(<ExtensionSlot name="qxz" render={() => <StubComponent1 />} />);
    expect(node.find(StubComponent1).length).toBe(1);
  });

  it('is able to (custom) render empty extension', () => {
    const node = mount(<ExtensionSlot name="foo" render={() => <StubComponent1 />} />);
    expect(node.find(StubComponent1).length).toBe(1);
  });

  it('is able to render extension with multiple entries', () => {
    const node = mount(<ExtensionSlot name="bar" />);
    expect(node.find(StubComponent1).length).toBe(2);
    expect(node.find(StubComponent2).length).toBe(1);
    expect(node.find(StubComponent3).length).toBe(0);
  });

  it('is able to render extension without displayName', () => {
    const node = mount(<ExtensionSlot name="bla" />);
    expect(node.find(StubComponent1).length).toBe(0);
    expect(node.find(StubComponent2).length).toBe(0);
    expect(node.find(StubComponent3).length).toBe(1);
  });

  it('overrides the empty renderer on not available extension', () => {
    const node = mount(<ExtensionSlot name="qxz" empty={() => <StubComponent1 key="empty" />} />);
    expect(node.find(StubComponent1).length).toBe(1);
    expect(node.find(StubComponent2).length).toBe(0);
  });

  it('overrides the empty renderer on an available extension', () => {
    const node = mount(<ExtensionSlot name="foo" empty={() => <StubComponent2 key="empty" />} />);
    expect(node.find(StubComponent1).length).toBe(0);
    expect(node.find(StubComponent2).length).toBe(1);
  });

  it('overrides the empty and default renderer on an available extension', () => {
    const node = mount(
      <ExtensionSlot
        name="foo"
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.find(StubComponent1).length).toBe(1);
    expect(node.find(StubComponent2).length).toBe(1);
  });

  it('does not use the render function with empty when emptySkipsRender is set', () => {
    const node = mount(
      <ExtensionSlot
        name="foo"
        emptySkipsRender
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.find(StubComponent1).length).toBe(0);
    expect(node.find(StubComponent2).length).toBe(1);
  });

  it('does use the render function without empty independent if emptySkipsRender is set', () => {
    const node = mount(
      <ExtensionSlot
        name="lol"
        emptySkipsRender
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.find(StubComponent1).length).toBe(2);
    expect(node.find(StubComponent2).length).toBe(0);
  });
});
