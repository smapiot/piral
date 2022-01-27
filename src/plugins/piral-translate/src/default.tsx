import type { FC } from 'react';
import { defaultRender } from 'piral-core';
import { LanguagesPickerProps } from './types';

export const DefaultPicker: FC<LanguagesPickerProps> = (props) => defaultRender(undefined);
