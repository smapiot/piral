import { addChangeHandler } from '@dbeining/react-atom';
import {
  PiletApiCreator,
  LoadPiletsOptions,
  CustomSpecLoaders,
  DefaultLoaderConfig,
  getDefaultLoader,
  extendLoader,
  PiletLoader,
} from 'piral-base';
import { globalDependencies } from './modules';
import type { Pilet, PiletRequester, GlobalStateContext, PiletLoadingStrategy, DependencySelector } from './types';

export interface PiletOptionsConfig {
  context: GlobalStateContext;
  loaders?: CustomSpecLoaders;
  loaderConfig?: DefaultLoaderConfig;
  availablePilets: Array<Pilet>;
  strategy: PiletLoadingStrategy;
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  requestPilets: PiletRequester;
  shareDependencies: DependencySelector;
}

export function createPiletOptions({
  context,
  loaders,
  loaderConfig,
  availablePilets,
  strategy,
  createApi,
  loadPilet,
  requestPilets,
  shareDependencies,
}: PiletOptionsConfig): LoadPiletsOptions {
  const dependencies = shareDependencies(globalDependencies);
  loadPilet = extendLoader(loadPilet ?? getDefaultLoader(loaderConfig), loaders);

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL) {
    const { installPiralDebug } = require('piral-debug-utils');

    installPiralDebug({
      createApi,
      loadPilet,
      injectPilet: context.injectPilet,
      fireEvent: context.emit,
      requestPilets,
      getDependencies() {
        return dependencies;
      },
      getRoutes() {
        const registeredRoutes = context.readState((state) => Object.keys(state.registry.pages));
        const componentRoutes = context.readState((state) => Object.keys(state.routes));
        return [...componentRoutes, ...registeredRoutes];
      },
      getGlobalState() {
        return context.readState((s) => s);
      },
      getPilets() {
        return context.readState((s) => s.modules);
      },
      setPilets(modules) {
        context.dispatch((state) => ({
          ...state,
          modules,
        }));
      },
      integrate(debug, wrapper) {
        context.dispatch((s) => ({
          ...s,
          components: {
            ...s.components,
            Debug: debug,
          },
          registry: {
            ...s.registry,
            wrappers: {
              ...s.registry.wrappers,
              '*': wrapper,
            },
          },
        }));
      },
      onChange(cb: (previous: any, current: any) => void) {
        addChangeHandler(context.state, 'debugging', ({ previous, current }) => {
          cb(previous, current);
        });
      },
    });
  }

  if (process.env.DEBUG_PILET) {
    const { withEmulatorPilets } = require('piral-debug-utils');

    requestPilets = withEmulatorPilets(requestPilets, {
      injectPilet: context.injectPilet,
      createApi,
      loadPilet,
    });
  }

  return {
    config: loaderConfig,
    strategy,
    loadPilet,
    createApi,
    pilets: availablePilets,
    fetchPilets: requestPilets,
    dependencies,
  };
}
