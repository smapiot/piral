import { ComponentType } from 'react';
import { OpenNotification } from 'piral-core';
import { createNotifications } from '../../components';
import { NotificationsContainerProps, NotificationsBuilder } from '../../types';

export interface NotificationsBuilderState {
  container: ComponentType<NotificationsContainerProps>;
  item: ComponentType<OpenNotification>;
}

function createInitialState(): NotificationsBuilderState {
  return {
    container: undefined,
    item: undefined,
  };
}

export function notificationsBuilder(state = createInitialState()): NotificationsBuilder {
  return {
    container(Component) {
      return notificationsBuilder({
        ...state,
        container: Component,
      });
    },
    item(Component) {
      return notificationsBuilder({
        ...state,
        item: Component,
      });
    },
    build() {
      return createNotifications({
        NotificationsContainer: state.container,
        NotificationItem: state.item,
      });
    },
  };
}
