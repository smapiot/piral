/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { SwitchErrorInfo } from './SwitchErrorInfo';

vitest.mock('../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
}));

vitest.mock('react', async () => ({
  ...((await vitest.importActual('react')) as any),
  useMemo: (cb) => cb(),
}));

const StubComponent1: React.FC<any> = (props) => <div role="stub" children={props.children} />;
const Unknown: React.FC<any> = (props) => <div role="unknown" children={props.children} />;

const state = {
  registry: {
    extensions: {},
  },
  errorComponents: {
    stubComponent1: StubComponent1,
    unknown: Unknown,
  },
};

describe('SwitchErrorInfo Module', () => {
  afterEach(() => {
    cleanup();
  });

  it('is able to render StubComponent1 component', () => {
    const node = render(<SwitchErrorInfo type="stubComponent1" />);
    expect(node.queryAllByRole('stub').length).toBe(1);
  });

  it('is able to default render Unknow component if the compenent name not available in state data', () => {
    const node = render(<SwitchErrorInfo type="notRealComponent" />);
    expect(node.queryAllByRole('unknown').length).toBe(1);
  });
});
