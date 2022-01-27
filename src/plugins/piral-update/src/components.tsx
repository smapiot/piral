import type { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { UpdateDialogProps } from './types';

export const PiralUpdateDialog: ComponentType<UpdateDialogProps> = getPiralComponent('UpdateDialog');
