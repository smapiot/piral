import * as React from 'react';
import { useGlobalState, OpenNotification } from 'piral-core';
import { NotificationsContainerProps } from '../types';

export interface NotificationsCreator {
  NotificationsContainer: React.ComponentType<NotificationsContainerProps>;
  NotificationItem: React.ComponentType<OpenNotification>;
}

export function createNotifications({ NotificationsContainer, NotificationItem }: NotificationsCreator): React.SFC {
  return () => {
    const notifications = useGlobalState(s => s.app.notifications);

    return (
      <NotificationsContainer>
        {notifications.map(n => (
          <NotificationItem {...n} key={n.id} />
        ))}
      </NotificationsContainer>
    );
  };
}
