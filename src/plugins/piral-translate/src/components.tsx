import type { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { LanguagesPickerProps } from './types';

export const PiralLanguagesPicker: ComponentType<LanguagesPickerProps> = getPiralComponent('LanguagesPicker');
