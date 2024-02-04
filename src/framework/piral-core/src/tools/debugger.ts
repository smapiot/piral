import { LoadPiletsOptions } from 'piral-base';
import { installPiralDebug, DebuggerExtensionOptions } from 'piral-debug-utils';
import { GlobalStateContext } from '../types';

export function integrateDebugger(
  context: GlobalStateContext,
  options: LoadPiletsOptions,
  debug: DebuggerExtensionOptions = {},
) {
  installPiralDebug({
    emulator: debug.emulator,
    customSettings: debug.customSettings,
    defaultSettings: debug.defaultSettings,
    addPilet: context.addPilet,
    removePilet: context.removePilet,
    updatePilet(pilet) {
      if (!pilet.disabled) {
        context.addPilet(pilet);
      } else {
        context.injectPilet(pilet);
      }
    },
    fireEvent: context.emit,
    getDependencies() {
      return Object.keys(options.dependencies);
    },
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
    navigate(path, state) {
      return context.navigation.push(path, state);
    },
    getPilets() {
      return context.readState((s) => s.modules);
    },
    integrate(dbg) {
      context.dispatch((s) => ({
        ...s,
        routes: {
          ...s.routes,
          ...dbg.routes,
        },
      }));

      context.state.subscribe((current, previous) => {
        const pilets = current.modules !== previous.modules;
        const pages = current.registry.pages !== previous.registry.pages || current.routes !== previous.routes;
        const extensions = current.registry.extensions !== previous.registry.extensions;
        const state = current !== previous;
        dbg.onChange(previous, current, {
          pilets,
          pages,
          extensions,
          state,
        });
      });
    },
  });
}
