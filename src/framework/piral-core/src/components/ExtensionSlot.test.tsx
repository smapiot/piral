/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ExtensionSlot } from './ExtensionSlot';

vitest.mock('../hooks/globalState', () => ({
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
    destroyPortal: vitest.fn(),
  }),
}));

vitest.mock('react', async () => ({
  ...((await vitest.importActual('react')) as any),
  useMemo(cb) {
    return cb();
  },
}));

// (React as any).useMemo = (cb) => cb();

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
  afterEach(() => {
    cleanup();
  });

  it('is able to default render not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" />);
    expect(node.queryAllByRole('stub1').length).toBe(0);
  });

  it('is able to (default) render empty extension', () => {
    const node = render(<ExtensionSlot name="foo" />);
    expect(node.queryAllByRole('stub1').length).toBe(0);
  });

  it('is able to custom render not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" render={() => <StubComponent1 />} />);
    expect(node.queryAllByRole('stub1').length).toBe(1);
  });

  it('is able to (custom) render empty extension', () => {
    const node = render(<ExtensionSlot name="foo" render={() => <StubComponent1 />} />);
    expect(node.queryAllByRole('stub1').length).toBe(1);
  });

  it('is able to render extension with multiple entries', () => {
    const node = render(<ExtensionSlot name="bar" />);
    expect(node.queryAllByRole('stub1').length).toBe(2);
    expect(node.queryAllByRole('stub2').length).toBe(1);
    expect(node.queryAllByRole('stub3').length).toBe(0);
  });

  it('is able to render extension without displayName', () => {
    const node = render(<ExtensionSlot name="bla" />);
    expect(node.queryAllByRole('stub1').length).toBe(0);
    expect(node.queryAllByRole('stub2').length).toBe(0);
    expect(node.queryAllByRole('stub3').length).toBe(1);
  });

  it('overrides the empty renderer on not available extension', () => {
    const node = render(<ExtensionSlot name="qxz" empty={() => <StubComponent1 key="empty" />} />);
    expect(node.queryAllByRole('stub1').length).toBe(1);
    expect(node.queryAllByRole('stub2').length).toBe(0);
  });

  it('overrides the empty renderer on an available extension', () => {
    const node = render(<ExtensionSlot name="foo" empty={() => <StubComponent2 key="empty" />} />);
    expect(node.queryAllByRole('stub1').length).toBe(0);
    expect(node.queryAllByRole('stub2').length).toBe(1);
  });

  it('overrides the empty and default renderer on an available extension', () => {
    const node = render(
      <ExtensionSlot
        name="foo"
        empty={() => <StubComponent2 key="empty" />}
        render={(nodes) => <StubComponent1 children={nodes} />}
      />,
    );
    expect(node.queryAllByRole('stub1').length).toBe(1);
    expect(node.queryAllByRole('stub2').length).toBe(1);
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
    expect(node.queryAllByRole('stub1').length).toBe(0);
    expect(node.queryAllByRole('stub2').length).toBe(1);
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
    expect(node.queryAllByRole('stub1').length).toBe(2);
    expect(node.queryAllByRole('stub2').length).toBe(0);
  });
});
