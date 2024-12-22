import * as React from 'react';
import { defaultRender } from 'piral-core';
import { ModalsHostProps, ModalsDialogProps } from './types';

export const DefaultHost: React.FC<ModalsHostProps> = (props) => (
  <div className="piral-modals-host">{props.open && <div className="piral-modals-overlay">{props.children}</div>}</div>
);

export const DefaultDialog: React.FC<ModalsDialogProps> = (props) => defaultRender(props.children);
