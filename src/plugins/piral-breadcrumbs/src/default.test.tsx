import * as React from 'react';
import { mount } from 'enzyme';
import { DefaultBreadcrumbsContainer } from './default';

jest.mock('piral-core', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
  ExtensionSlot({ empty, params }: any) {
    const exts: any = state.registry.extensions;

    if (exts.dashboard) {
      return (
        <div>
          {exts.dashboard.map(({ component: Component }, i) => (
            <Component {...params} key={i} />
          ))}
        </div>
      );
    }

    return empty();
  },
  defaultRender(child: any, key?: string) {
    return <React.Fragment key={key}>{child}</React.Fragment>;
  },
}));

const state = {
  registry: {
    tiles: {},
    extensions: {},
  },
};

(React as any).useMemo = (cb) => cb();

const StubBreadcrumbsContainer: React.FC = () => <div />;
StubBreadcrumbsContainer.displayName = 'StubBreadcrumbsContainer';

const StubBreadcrumbItem: React.FC = () => <div />;
StubBreadcrumbItem.displayName = 'BreadcrumbItem';

describe('Default Breadcrumbs Component', () => {
  it('renders the react fragment in the default case', () => {
    (state.registry.tiles as any).a = {
      component: StubBreadcrumbItem,
      preferences: {},
    };
    const node = mount(
      <DefaultBreadcrumbsContainer>
        <StubBreadcrumbItem />
      </DefaultBreadcrumbsContainer>,
    );
    expect(node.find(StubBreadcrumbsContainer).length).toBe(0);
    expect(node.find(StubBreadcrumbItem).length).toBe(1);
  });

  it('renders the provided extension in the default case', () => {
    (state.registry.extensions as any).dashboard = [
      {
        component: StubBreadcrumbsContainer,
      },
    ];
    const node = mount(
      <DefaultBreadcrumbsContainer>
        <StubBreadcrumbItem />
      </DefaultBreadcrumbsContainer>,
    );
    expect(node.find(StubBreadcrumbItem).length).toBe(0);
    expect(node.find(StubBreadcrumbsContainer).length).toBe(1);
  });
});
