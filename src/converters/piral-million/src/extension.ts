import type { ExtensionSlotProps } from 'piral-core';
import { createElement, useContext } from 'million/react';
import { piralContext } from './mount';

export function createExtension(rootName: string) {
  return (props: ExtensionSlotProps) => {
    const { piral } = useContext(piralContext);
    const m = createElement as any;
    //TODO
    return m(rootName);
  };
}
