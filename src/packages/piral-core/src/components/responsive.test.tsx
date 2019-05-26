import * as React from 'react';
import * as hooks from '../hooks';
import { mount } from 'enzyme';
import { Responsive } from './responsive';

jest.mock('../hooks');

(hooks as any).useGlobalState = (select: any) =>
  select({
    app: {
      layout: {
        current: 'desktop',
        breakpoints: ['a', 'b', 'c'],
      },
    },
  });

(hooks as any).useMedia = () => 'desktop';

const changeTo = jest.fn();
(hooks as any).useAction = () => changeTo;

const StubComponent: React.SFC = props => <div />;
StubComponent.displayName = 'StubComponent';

describe('Responsive Module', () => {
  it('always renders the given children', () => {
    const node = mount(
      <Responsive>
        <StubComponent />)
      </Responsive>,
    );
    expect(node.find(StubComponent).length).toBe(1);
  });

  it('does not call changeTo when nothing changed', () => {
    const node = mount(<Responsive />);
    expect(changeTo).not.toHaveBeenCalled();
  });

  it('does not call changeTo when nothing changed', () => {
    const node = mount(<Responsive />);
    expect(changeTo).not.toHaveBeenCalled();
  });

  it('does calls changeTo when someething changed (desktop -> tablet)', () => {
    (hooks as any).useMedia = () => 'tablet';
    const node = mount(<Responsive />);
    expect(changeTo).toHaveBeenCalledWith('tablet');
  });

  it('does calls changeTo when someething changed (desktop -> mobile)', () => {
    (hooks as any).useMedia = () => 'mobile';
    const node = mount(<Responsive />);
    expect(changeTo).toHaveBeenCalledWith('mobile');
  });
});
