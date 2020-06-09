import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { LanguagesPickerProps } from './types';

export const PiralLanguagesPicker: React.ComponentType<LanguagesPickerProps> = getPiralComponent('LanguagesPicker');
