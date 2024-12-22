/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { DefaultErrorInfo } from './DefaultErrorInfo';

vitest.mock('../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
}));

const state = {
  components: {},
  registry: {
    extensions: {},
  },
  errorComponents: {},
};

const StubErrorInfo: React.FC = (props) => <div role="stub" />;
StubErrorInfo.displayName = 'StubErrorInfo';

describe('Default Error Info Component', () => {
  it('renders the switch-case in the loading error case', () => {
    const node = render(<DefaultErrorInfo type="loading" error="foo" />);
    expect(node.queryAllByRole('stub').length).toBe(0);
    expect(node.queryAllByText('Error: loading').length).toBe(1);
  });

  it('renders the switch-case in the not_found error case', () => {
    const node = render(
      <DefaultErrorInfo type="not_found" location={{ pathname: 'foo', hash: '', key: '', search: '', state: '' }} />,
    );
    expect(node.queryAllByRole('stub').length).toBe(0);
    expect(node.queryAllByText('Error: not_found').length).toBe(1);
  });

  it('renders the switch-case in the page error case', () => {
    const node = render(
      <DefaultErrorInfo
        error={undefined}
        type="page"
        location={{ pathname: 'bar', hash: '', key: '', search: '', state: '' }}
      />,
    );
    expect(node.queryAllByRole('stub').length).toBe(0);
    expect(node.queryAllByText('Error: page').length).toBe(1);
  });

  it('renders the react fragment in the default case', () => {
    (state.registry.extensions as any).error = [
      {
        component: StubErrorInfo,
      },
    ];
    const node = render(<DefaultErrorInfo type="extension" error="foo" />);
    expect(node.queryAllByRole('stub').length).toBe(1);
    expect(node.queryAllByText('Error: extension').length).toBe(0);
  });
});
