import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { ModalsProps, DialogProps } from './types';

export const PiralModalsHost: React.ComponentType<ModalsProps> = getPiralComponent('Modals');
export const PiralModalDialog: React.ComponentType<DialogProps> = getPiralComponent('Dialog');
