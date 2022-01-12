import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { NotificationsHostProps, NotificationsToastProps } from './types';

export const PiralNotificationsHost: React.ComponentType<NotificationsHostProps> =
  getPiralComponent('NotificationsHost');
export const PiralNotificationsToast: React.ComponentType<NotificationsToastProps> =
  getPiralComponent('NotificationsToast');
