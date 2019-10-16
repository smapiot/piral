import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { NotificationsProps, ToastProps } from './types';

export const PiralNotificationsHost: React.ComponentType<NotificationsProps> = getPiralComponent('Notifications');
export const PiralNotificationToast: React.ComponentType<ToastProps> = getPiralComponent('Toast');
