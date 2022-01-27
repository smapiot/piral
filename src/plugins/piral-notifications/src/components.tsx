import type { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { NotificationsHostProps, NotificationsToastProps } from './types';

export const PiralNotificationsHost: ComponentType<NotificationsHostProps> = getPiralComponent('NotificationsHost');
export const PiralNotificationsToast: ComponentType<NotificationsToastProps> = getPiralComponent('NotificationsToast');
