import * as React from 'react';
import { ExtensionSlot, ErrorInfoProps } from 'piral-core';
import { SwitchErrorInfo } from './SwitchErrorInfo';

export const DefaultErrorInfo: React.FC<ErrorInfoProps> = props => (
  <>
    <SwitchErrorInfo {...props} />
    <ExtensionSlot name={`error_${props.type}`} params={props} />
  </>
);
