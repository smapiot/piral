import * as React from 'react';
import { ExtensionSlot } from '../components/ExtensionSlot';
import { SwitchErrorInfo } from '../components/SwitchErrorInfo';
import { ErrorInfoProps } from '../types';

/**
 * The default error info component. Just uses the "error" extension slot.
 * Leverage the default one by registration of respective extensions using
 * the "error" name.
 */
export const DefaultErrorInfo: React.FC<ErrorInfoProps> = (props) => (
  <ExtensionSlot name="error" params={props} empty={() => <SwitchErrorInfo {...props} />} />
);
DefaultErrorInfo.displayName = 'DefaultErrorInfo';
