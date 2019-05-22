import * as React from 'react';
import { useGlobalState, OpenNotification } from 'piral-core';

const NotificationItem: React.SFC<OpenNotification> = ({ options, close, content }) => (
  <pi-item class={options.type || 'info'}>
    <pi-details>
      {options.title && <pi-title>{options.title}</pi-title>}
      <pi-description>{content}</pi-description>
    </pi-details>
    <pi-close onClick={close} />
  </pi-item>
);

export const Notifications: React.SFC = () => {
  const notifications = useGlobalState(s => s.app.notifications);

  return (
    <pi-notifications>
      {notifications.map(n => (
        <NotificationItem {...n} key={n.id} />
      ))}
    </pi-notifications>
  );
};
