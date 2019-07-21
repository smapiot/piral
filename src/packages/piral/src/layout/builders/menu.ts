import { ComponentType } from 'react';
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
  return {
    container(Component) {
      return menuBuilder({
        ...state,
        container: Component,
      });
    },
    item(Component) {
      return menuBuilder({
        ...state,
        item: Component,
      });
    },
    build() {
      return createMenu({
        MenuContainer: state.container,
        MenuItem: state.item,
      });
    },
  };
}
