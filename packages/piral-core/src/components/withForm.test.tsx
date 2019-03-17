import * as React from 'react';
import * as hooks from '../hooks';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { withForm } from './withForm';

jest.mock('../hooks');

const mountWithRouter = (node, url = '/') =>
  mount(
    <MemoryRouter initialEntries={[url]} initialIndex={0}>
      {node}
    </MemoryRouter>,
  );

const StubComponent: React.SFC<{ data: any }> = () => <div />;
StubComponent.displayName = 'StubComponent';

describe('withForm Module', () => {
  it('shows loading without invoking action if already loading', () => {
    const options: any = { id: 'bar' };
    const usedForm = jest.fn(() => {});
    (hooks as any).useForm = usedForm;
    const Component: any = withForm(StubComponent, options);
    mountWithRouter(<Component />);
    expect(usedForm).toHaveBeenCalled();
  });
});
