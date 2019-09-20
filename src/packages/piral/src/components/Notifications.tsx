import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { OpenNotification } from 'piral-ext';
import { NotificationsContainerProps } from '../types';

export interface NotificationsCreator {
  NotificationsContainer: React.ComponentType<NotificationsContainerProps>;
  NotificationItem: React.ComponentType<OpenNotification>;
}

export function createNotifications({ NotificationsContainer, NotificationItem }: NotificationsCreator): React.FC {
  return () => {
    const notifications = useGlobalState(s => s.notifications);

    return (
      <NotificationsContainer>
        {notifications.map(n => (
          <NotificationItem {...n} key={n.id} />
        ))}
      </NotificationsContainer>
    );
  };
}
