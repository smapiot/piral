import type { LoadPiletsOptions } from 'prial-base';
import type { DebuggerExtensionOptions } from 'piral-debug-utils';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from 'react-router';
import type { AppPath, GlobalState, GlobalStateContext, NavigationApi } from './src/types';

export const publicPath: string;

export function createNavigation(): NavigationApi;

export function createDefaultState(): GlobalState;

export function createRedirect(to: string): ComponentType<RouteComponentProps>;

export function fillDependencies(deps: Record<string, any>): void;

export function useRouteFilter(paths: Array<AppPath>): Array<AppPath>;

export function integrateDebugger(
  context: GlobalStateContext,
  options: LoadPiletsOptions,
  debug?: DebuggerExtensionOptions,
): void;

export function integrateEmulator(
  context: GlobalStateContext,
  options: LoadPiletsOptions,
  debug?: DebuggerExtensionOptions,
): void;
