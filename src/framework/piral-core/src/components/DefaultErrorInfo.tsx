import * as React from 'react';
import { ExtensionSlot } from './ExtensionSlot';
import { SwitchErrorInfo } from './SwitchErrorInfo';
import { ErrorInfoProps } from '../types';

/**
 * The default error info component. Just uses the "error" extension slot.
 * Leverage the default one by registration of respective extensions using
 * the "error" name.
 */
export const DefaultErrorInfo: React.FC<ErrorInfoProps> = (props) => (
  <ExtensionSlot name="error" params={props} empty={() => <SwitchErrorInfo key="default_error" {...props} />} />
);
DefaultErrorInfo.displayName = 'DefaultErrorInfo';
