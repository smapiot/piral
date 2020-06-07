import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { ModalsHostProps, ModalsDialogProps } from './types';

export const PiralModalsHost: React.ComponentType<ModalsHostProps> = getPiralComponent('ModalsHost');
export const PiralModalsDialog: React.ComponentType<ModalsDialogProps> = getPiralComponent('ModalsDialog');
