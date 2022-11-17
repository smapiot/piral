import * as React from 'react';
import { render } from '@testing-library/react';
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
    navigation: {
      router: undefined,
    },
    readState() {
      return '/';
    },
    destroyPortal: jest.fn(),
  }),
}));

(React as any).useMemo = (cb) => cb();

const StubComponent1: React.FC<any> = (props) => <div role="stub1" children={props.children} />;
StubComponent1.displayName = 'StubComponent1';

const StubComponent2: React.FC<any> = (props) => <div role="stub2" children={props.children} />;
StubComponent2.displayName = 'StubComponent2';

const StubComponent3: React.FC<any> = (props) => <div role="stub3" children={props.children} />;

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
    const node = render(<ExtensionSlot />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
    expect(node.container.querySelectorAll('div').length).toBe(0);
  });

  it('is able to default render given component with no name', () => {
    const component = {
      type: 'html',
      component: {
        mount(element) {
          const container = document.createElement('strong');
          container.textContent = 'Hello!';
          element.appendChild(container);
        },
      },
    };
    const node = render(<ExtensionSlot params={{ component }} />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
    expect(node.container.querySelectorAll('strong').length).toBe(1);
    expect(node.container.textContent).toContain('Hello!');
  });

  it('is able to default render not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
  });

  it('is able to (default) render empty extension', () => {
    const node = render(<ExtensionSlot name="foo" />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
  });

  it('is able to custom render not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" render={() => <StubComponent1 />} />);
    expect(node.queryAllByRole("stub1").length).toBe(1);
  });

  it('is able to (custom) render empty extension', () => {
    const node = render(<ExtensionSlot name="foo" render={() => <StubComponent1 />} />);
    expect(node.queryAllByRole("stub1").length).toBe(1);
  });

  it('is able to render extension with multiple entries', () => {
    const node = render(<ExtensionSlot name="bar" />);
    expect(node.queryAllByRole("stub1").length).toBe(2);
    expect(node.queryAllByRole("stub2").length).toBe(1);
    expect(node.queryAllByRole("stub3").length).toBe(0);
  });

  it('is able to render extension without displayName', () => {
    const node = render(<ExtensionSlot name="bla" />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
    expect(node.queryAllByRole("stub2").length).toBe(0);
    expect(node.queryAllByRole("stub3").length).toBe(1);
  });

  it('overrides the empty renderer on not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" empty={() => <StubComponent1 key="empty" />} />);
    expect(node.queryAllByRole("stub1").length).toBe(1);
    expect(node.queryAllByRole("stub2").length).toBe(0);
  });

  it('overrides the empty renderer on an available extension', () => {
    const node = render(<ExtensionSlot name="foo" empty={() => <StubComponent2 key="empty" />} />);
    expect(node.queryAllByRole("stub1").length).toBe(0);
    expect(node.queryAllByRole("stub2").length).toBe(1);
  });

  it('overrides the empty and default renderer on an available extension', () => {
    const node = render(
      <ExtensionSlot
        name="foo"
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.queryAllByRole("stub1").length).toBe(1);
    expect(node.queryAllByRole("stub2").length).toBe(1);
  });

  it('does not use the render function with empty when emptySkipsRender is set', () => {
    const node = render(
      <ExtensionSlot
        name="foo"
        emptySkipsRender
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.queryAllByRole("stub1").length).toBe(0);
    expect(node.queryAllByRole("stub2").length).toBe(1);
  });

  it('does use the render function without empty independent if emptySkipsRender is set', () => {
    const node = render(
      <ExtensionSlot
        name="lol"
        emptySkipsRender
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.queryAllByRole("stub1").length).toBe(2);
    expect(node.queryAllByRole("stub2").length).toBe(0);
  });
});
