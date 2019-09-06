import { ComponentType } from 'react';
import { OpenNotification } from 'piral-core';
import { createBuilder } from './createBuilder';
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
  const initial = {
    build() {
      return createNotifications({
        NotificationsContainer: state.container,
        NotificationItem: state.item,
      });
    },
  } as NotificationsBuilder;
  return createBuilder(initial, state, notificationsBuilder);
}
