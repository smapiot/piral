import type { ExtensionSlotProps } from 'piral-core';
import { m } from 'million';

export const Extension = (props: ExtensionSlotProps) => m('piral-extension', props);
