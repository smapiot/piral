import * as React from 'react';
import { render } from '@testing-library/react';
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

const StubBreadcrumbsContainer: React.FC = () => <ul />;
StubBreadcrumbsContainer.displayName = 'StubBreadcrumbsContainer';

const StubBreadcrumbItem: React.FC = () => <li />;
StubBreadcrumbItem.displayName = 'BreadcrumbItem';

describe('Default Breadcrumbs Component', () => {
  it('renders the react fragment in the default case', () => {
    (state.registry.tiles as any).a = {
      component: StubBreadcrumbItem,
      preferences: {},
    };
    const node = render(
      <DefaultBreadcrumbsContainer>
        <StubBreadcrumbItem />
      </DefaultBreadcrumbsContainer>,
    );
    expect(node.queryByRole('list')).toBe(null);
    expect(node.getAllByRole('listitem').length).toBe(1);
  });

  it('renders the provided extension in the default case', () => {
    (state.registry.extensions as any).dashboard = [
      {
        component: StubBreadcrumbsContainer,
      },
    ];
    const node = render(
      <DefaultBreadcrumbsContainer>
        <StubBreadcrumbItem />
      </DefaultBreadcrumbsContainer>,
    );
    expect(node.queryByRole('listitem')).toBe(null);
    expect(node.getAllByRole('list').length).toBe(1);
  });
});
