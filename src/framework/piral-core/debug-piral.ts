import { addChangeHandler } from '@dbeining/react-atom';
import { LoadPiletsOptions } from 'piral-base';
import { installPiralDebug } from 'piral-debug-utils';
import { GlobalStateContext } from './lib/types';

export function integrate(context: GlobalStateContext, options: LoadPiletsOptions) {
  installPiralDebug({
    createApi: options.createApi,
    loadPilet: options.loadPilet,
    injectPilet: context.injectPilet,
    fireEvent: context.emit,
    dependencies: options.dependencies,
    getExtensions() {
      return context.readState((s) => Object.keys(s.registry.extensions));
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
    integrate(dbg) {
      context.dispatch((s) => ({
        ...s,
        components: {
          ...s.components,
          ...dbg.components,
        },
        routes: {
          ...s.routes,
          ...dbg.routes,
        },
        registry: {
          ...s.registry,
          wrappers: {
            ...s.registry.wrappers,
            ...dbg.wrappers,
          },
        },
      }));
      addChangeHandler(context.state, 'debugging', ({ previous, current }) => {
        const pilets = current.modules !== previous.modules;
        const pages = current.registry.pages !== previous.registry.pages || current.routes !== previous.routes;
        const extensions = current.registry.extensions !== previous.registry.extensions;
        dbg.onChange(previous, current, {
          pilets,
          pages,
          extensions,
        });
      });
    },
  });
}
