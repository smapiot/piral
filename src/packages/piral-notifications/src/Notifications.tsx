import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralNotificationsToast, PiralNotificationsHost } from './components';

export const Notifications: React.FC = () => {
  const notifications = useGlobalState(s => s.notifications);

  return (
    <PiralNotificationsHost>
      {notifications.map(n => (
        <PiralNotificationsToast {...n} key={n.id} />
      ))}
    </PiralNotificationsHost>
  );
};
Notifications.displayName = 'Notifications';
