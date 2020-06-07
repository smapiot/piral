import * as React from 'react';
import { ExtensionSlot } from './ExtensionSlot';
import { SwitchErrorInfo } from './SwitchErrorInfo';
import { ErrorInfoProps } from '../types';

export const DefaultErrorInfo: React.FC<ErrorInfoProps> = props => (
  <ExtensionSlot name="error" params={props} empty={() => <SwitchErrorInfo key="default_error" {...props} />} />
);
DefaultErrorInfo.displayName = 'DefaultErrorInfo';
