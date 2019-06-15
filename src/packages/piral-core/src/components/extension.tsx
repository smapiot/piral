import * as React from 'react';
import { useExtension } from '../hooks';
import { ExtensionSlotProps } from '../types';

export function getExtensionSlot(name: string) {
  const ExtensionSlotView: React.SFC<ExtensionSlotProps> = props => {
    const Extension = useExtension(name);
    return <Extension {...props} />;
  };
  ExtensionSlotView.displayName = `ExtensionSlot_${name}`;
  return ExtensionSlotView;
}
