import * as React from 'react';
import { defaultRender } from 'piral-core';
import { NotificationsHostProps, NotificationsToastProps } from './types';

export const DefaultHost: React.FC<NotificationsHostProps> = (props) => (
  <div className="piral-notifications-host" key="default_notifications">
    {props.children}
  </div>
);

export const DefaultToast: React.FC<NotificationsToastProps> = ({ children }) => defaultRender(children);
