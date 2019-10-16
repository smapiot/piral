import * as React from 'react';
import { defaultRender } from 'piral-core';
import { NotificationsProps, ToastProps } from './types';

export const DefaultNotifications: React.FC<NotificationsProps> = props => (
  <div className="piral-notifications-host" key="default_notifications">
    {props.children}
  </div>
);

export const DefaultToast: React.FC<ToastProps> = props => defaultRender(props.content);
