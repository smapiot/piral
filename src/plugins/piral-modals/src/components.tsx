import { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { ModalsHostProps, ModalsDialogProps } from './types';

export const PiralModalsHost: ComponentType<ModalsHostProps> = getPiralComponent('ModalsHost');
export const PiralModalsDialog: ComponentType<ModalsDialogProps> = getPiralComponent('ModalsDialog');
