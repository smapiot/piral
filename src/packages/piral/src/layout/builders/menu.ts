import { ComponentType } from 'react';
import { createBuilder } from './createBuilder';
import { createMenu } from '../../components';
import { MenuContainerProps, MenuItemProps, MenuBuilder } from '../../types';

export interface MenuBuilderState {
  container: ComponentType<MenuContainerProps>;
  item: ComponentType<MenuItemProps>;
}

function createInitialState(): MenuBuilderState {
  return {
    container: undefined,
    item: undefined,
  };
}

export function menuBuilder(state = createInitialState()): MenuBuilder {
  const initial = {
    build() {
      return createMenu({
        MenuContainer: state.container,
        MenuItem: state.item,
      });
    },
  } as MenuBuilder;
  return createBuilder(initial, state, menuBuilder);
}
