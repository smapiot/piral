import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralNotificationsToast, PiralNotificationsHost } from './components';

export const Notifications: React.FC = () => {
  const notifications = useGlobalState((s) => s.notifications);

  return (
    <PiralNotificationsHost>
      {notifications.map(({ component: Component, close, options, id }) => (
        <PiralNotificationsToast onClose={close} options={options} key={id}>
          <Component onClose={close} options={options} />
        </PiralNotificationsToast>
      ))}
    </PiralNotificationsHost>
  );
};
Notifications.displayName = 'Notifications';
