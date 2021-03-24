import * as React from 'react';
import { defaultRender } from 'piral-core';
import { UpdateDialogProps } from './types';

export const DefaultUpdateDialog: React.FC<UpdateDialogProps> = (props) => defaultRender(props.children);
