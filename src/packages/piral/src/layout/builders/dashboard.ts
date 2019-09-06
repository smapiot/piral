import { ComponentType } from 'react';
import { createBuilder } from './createBuilder';
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
  const initial = {
    build() {
      return createDashboard({
        DashboardContainer: state.container,
        Tile: state.tile,
      });
    },
  } as DashboardBuilder;
  return createBuilder(initial, state, dashboardBuilder);
}
