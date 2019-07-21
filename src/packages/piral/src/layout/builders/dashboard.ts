import { ComponentType } from 'react';
import { createDashboard } from '../../components';
import { DashboardContainerProps, TileProps, DashboardBuilder } from '../../types';

export interface DashboardBuilderState {
  container: ComponentType<DashboardContainerProps>;
  tile: ComponentType<TileProps>;
}

function createInitialState(): DashboardBuilderState {
  return {
    container: undefined,
    tile: undefined,
  };
}

export function dashboardBuilder(state = createInitialState()): DashboardBuilder {
  return {
    container(Component) {
      return dashboardBuilder({
        ...state,
        container: Component,
      });
    },
    tile(Component) {
      return dashboardBuilder({
        ...state,
        tile: Component,
      });
    },
    build() {
      return createDashboard({
        DashboardContainer: state.container,
        Tile: state.tile,
      });
    },
  };
}
