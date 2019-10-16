import * as React from 'react';
import { defaultRender } from 'piral-core';
import { ModalsProps, DialogProps } from './types';

export const DefaultModals: React.FC<ModalsProps> = props => (
  <div className="piral-modals-host" key="default_modals">
    {props.open && <div className="piral-modals-overlay">{props.children}</div>}
  </div>
);

export const DefaultDialog: React.FC<DialogProps> = props => defaultRender(props.children);
