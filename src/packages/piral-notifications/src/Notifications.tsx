import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralNotificationToast, PiralNotificationsHost } from './components';

export const Notifications: React.FC = () => {
  const notifications = useGlobalState(s => s.notifications);

  return (
    <PiralNotificationsHost>
      {notifications.map(n => (
        <PiralNotificationToast {...n} key={n.id} />
      ))}
    </PiralNotificationsHost>
  );
};
Notifications.displayName = 'Notifications';
