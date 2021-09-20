import { isfunc } from 'piral-base';
import { DebugTracker } from './DebugTracker';
import { VisualizationWrapper } from './VisualizationWrapper';
import { decycle } from './decycle';
import { DebuggerOptions } from './types';

export function installPiralDebug(options: DebuggerOptions) {
  const { context, onChange, ...pilets } = options;
  const selfSource = 'piral-debug-api';
  const debugApiVersion = 'v1';
  const settings = {
    viewState: {
      value: sessionStorage.getItem('dbg:view-state') !== 'off',
      type: 'boolean',
      label: 'State container logging',
    },
    loadPilets: {
      value: sessionStorage.getItem('dbg:load-pilets') === 'on',
      type: 'boolean',
      label: 'Load available pilets',
    },
    hardRefresh: {
      value: sessionStorage.getItem('dbg:hard-refresh') === 'on',
      type: 'boolean',
      label: 'Full refresh on change',
    },
    viewOrigins: {
      value: sessionStorage.getItem('dbg:view-origins') === 'on',
      type: 'boolean',
      label: 'Visualize component origins',
    },
  };
  const events = [];

  const sendMessage = (content: any) => {
    window.postMessage(
      {
        content,
        source: selfSource,
        version: debugApiVersion,
      },
      '*',
    );
  };

  const sendCurrentPilets = (pilets: Array<any>) => {
    sendMessage({
      type: 'pilets',
      pilets: pilets.map((pilet) => ({
        name: pilet.name,
        version: pilet.version,
        disabled: !!pilet.disabled,
      })),
    });
  };

  const sendCurrentContainer = (state: any) => {
    sendMessage({
      type: 'container',
      container: decycle(state),
    });
  };

  const sendCurrentRoutes = (pages: Record<string, any>, routes: Record<string, any>) => {
    const registeredRoutes = Object.keys(pages);
    const componentRoutes = Object.keys(routes);
    sendMessage({
      type: 'routes',
      routes: [...componentRoutes, ...registeredRoutes],
    });
  };

  const setSetting = (setting: { value: any }, key: string, value: any) => {
    setting.value = value;
    sessionStorage.setItem(key, value ? 'on' : 'off');
  };

  const updateSettings = (values: Record<string, any>) => {
    const prev = settings.viewOrigins.value;
    setSetting(settings.viewState, 'dbg:view-state', values.viewState);
    setSetting(settings.loadPilets, 'dbg:load-pilets', values.loadPilets);
    setSetting(settings.hardRefresh, 'dbg:hard-refresh', values.hardRefresh);
    setSetting(settings.viewOrigins, 'dbg:view-origins', values.viewOrigins);
    const curr = settings.viewOrigins.value;

    if (prev !== curr) {
      updateVisualize(curr);
    }

    sendMessage({
      settings,
      type: 'settings',
    });
  };

  const togglePilet = (name: string) => {
    const pilet: any = context.readState((state) => state.modules).find((m) => m.name === name);

    if (pilet.disabled) {
      try {
        const { createApi } = options;
        const newApi = createApi(pilet);
        context.injectPilet(pilet.original);
        pilet.original.setup(newApi);
      } catch (error) {
        console.error(error);
      }
    } else {
      context.injectPilet({ name, disabled: true, original: pilet } as any);
    }
  };

  const removePilet = (name: string) => {
    context.injectPilet({ name } as any);
    context.dispatch((state) => ({
      ...state,
      modules: state.modules.filter((m) => m.name !== name),
    }));
  };

  const appendPilet = (meta: any) => {
    const { createApi, loadPilet } = options;
    loadPilet(meta).then((pilet) => {
      try {
        const newApi = createApi(pilet);
        context.injectPilet(pilet);
        pilet.setup(newApi as any);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const toggleVisualize = () => {
    context.dispatch((s) => ({
      ...s,
      $debug: {
        ...s.$debug,
        visualize: {
          ...s.$debug.visualize,
          force: !s.$debug.visualize.force,
        },
      },
    }));
  };

  const updateVisualize = (active: boolean) => {
    context.dispatch((s) => ({
      ...s,
      $debug: {
        ...s.$debug,
        visualize: {
          ...s.$debug.visualize,
          active,
        },
      },
    }));
  };

  const goToRoute = (route: string) => {
    context.dispatch((s) => ({
      ...s,
      $debug: {
        ...s.$debug,
        route,
      },
    }));
  };

  const eventDispatcher = document.body.dispatchEvent;

  const debugApi = {
    debug: debugApiVersion,
    instance: {
      name: process.env.BUILD_PCKG_NAME,
      version: process.env.BUILD_PCKG_VERSION,
      dependencies: process.env.SHARED_DEPENDENCIES,
      context,
    },
    build: {
      date: process.env.BUILD_TIME_FULL,
      cli: process.env.PIRAL_CLI_VERSION,
      compat: process.env.DEBUG_PIRAL,
    },
    pilets,
  };

  const start = () => {
    const registeredRoutes = context.readState((state) => Object.keys(state.registry.pages));
    const componentRoutes = context.readState((state) => Object.keys(state.routes));
    const routes = [...componentRoutes, ...registeredRoutes];
    const container = decycle(context.readState((s) => s));
    const pilets = context
      .readState((m) => m.modules)
      .map((pilet: any) => ({
        name: pilet.name,
        version: pilet.version,
        disabled: pilet.disabled,
      }));

    sendMessage({
      type: 'available',
      name: debugApi.instance.name,
      version: debugApi.instance.version,
      kind: debugApiVersion,
      capabilities: ['events', 'container', 'routes', 'pilets', 'settings'],
      state: {
        routes,
        pilets,
        container,
        settings,
        events,
      },
    });
  };

  document.body.dispatchEvent = function (ev: CustomEvent) {
    if (ev.type.startsWith('piral-')) {
      events.unshift({
        id: events.length.toString(),
        name: ev.type.replace('piral-', ''),
        args: decycle(ev.detail.arg),
        time: Date.now(),
      });

      sendMessage({
        events,
        type: 'events',
      });
    }

    return eventDispatcher.call(this, ev);
  };

  context.dispatch((s) => ({
    ...s,
    $debug: {
      visualize: {
        active: settings.viewOrigins.value,
        force: false,
      },
      route: undefined,
    },
    components: {
      ...s.components,
      Debug: DebugTracker,
    },
    registry: {
      ...s.registry,
      wrappers: {
        ...s.registry.wrappers,
        '*': VisualizationWrapper,
      },
    },
  }));

  window.addEventListener('storage', (event) => {
    if (event.storageArea === sessionStorage) {
      // potentially unknowingly updated settings
      updateSettings({
        viewState: sessionStorage.getItem('dbg:view-state') !== 'off',
        loadPilets: sessionStorage.getItem('dbg:load-pilets') === 'on',
        hardRefresh: sessionStorage.getItem('dbg:hard-refresh') === 'on',
        viewOrigins: sessionStorage.getItem('dbg:view-origins') === 'on',
      });
    }
  });

  window.addEventListener('message', (event) => {
    const { source, version, content } = event.data;

    if (source !== selfSource && version === debugApiVersion) {
      switch (content.type) {
        case 'init':
          return start();
        case 'update-settings':
          return updateSettings(content.settings);
        case 'append-pilet':
          return appendPilet(content.meta);
        case 'remove-pilet':
          return removePilet(content.name);
        case 'toggle-pilet':
          return togglePilet(content.name);
        case 'emit-event':
          return context.emit(content.name, content.args);
        case 'goto-route':
          return goToRoute(content.route);
        case 'visualize-all':
          return toggleVisualize();
      }
    }
  });

  if (isfunc(onChange)) {
    onChange((previous, current) => {
      if (settings.viewState.value) {
        const infos = new Error().stack;

        if (infos) {
          // Chrome, Firefox, ... (full capability)
          const lastLine = infos.split('\n')[7];

          if (lastLine) {
            const action = lastLine.replace(/^\s+at\s+(Atom\.|Object\.)?/, '');
            console.group(
              `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
              'color: gray; font-weight: lighter;',
              'color: black; font-weight: bold;',
            );
            console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
            console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
            console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
            console.groupEnd();
          }
        } else {
          // IE 11, ... (does not know colors etc.)
          console.log('Changed state', previous, current);
        }
      }

      if (current.modules !== previous.modules) {
        sendCurrentPilets(current.modules);
      }

      if (current.registry.pages !== previous.registry.pages || current.routes !== previous.routes) {
        sendCurrentRoutes(current.registry.pages, current.routes);
      }

      sendCurrentContainer(current);
    });
  }

  window['dbg:piral'] = debugApi;
  start();
}
