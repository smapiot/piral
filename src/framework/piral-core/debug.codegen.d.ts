import type { LoadPiletsOptions } from 'prial-base';
import type { DebuggerExtensionOptions } from 'piral-debug-utils';
import type { GlobalStateContext } from './src/types';

export function integrateDebugger(
  context: GlobalStateContext,
  options: LoadPiletsOptions,
  debug?: DebuggerExtensionOptions,
): void;

export function integrateEmulator(context: GlobalStateContext, options, debug?: DebuggerExtensionOptions): void;
