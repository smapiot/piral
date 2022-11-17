import * as React from 'react';
import { render } from '@testing-library/react';
import { SwitchErrorInfo } from './SwitchErrorInfo';

jest.mock('../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
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

(React as any).useMemo = (cb) => cb();

describe('SwitchErrorInfo Module', () => {
  it('is able to render StubComponent1 component', () => {
    const node = render(<SwitchErrorInfo type="stubComponent1" />);
    expect(node.queryAllByRole('stub').length).toBe(1);
  });

  it('is able to default render Unknow component if the compenent name not available in state data', () => {
    const node = render(<SwitchErrorInfo type="notRealComponent" />);
    expect(node.queryAllByRole('unknown').length).toBe(1);
  });
});
