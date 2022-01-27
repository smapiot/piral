import { FC } from 'react';
import { defaultRender } from 'piral-core';
import { UpdateDialogProps } from './types';

export const DefaultUpdateDialog: FC<UpdateDialogProps> = (props) => defaultRender(props.children);
