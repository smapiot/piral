import { DebugTracker } from './DebugTracker';
import { VisualizationWrapper } from './VisualizationWrapper';
import { ExtensionCatalogue } from './ExtensionCatalogue';
import { decycle } from './decycle';
import { setState, initialSettings } from './state';
import { DebugCustomSetting, DebuggerOptions } from './types';

export function installPiralDebug(options: DebuggerOptions) {
  const {
    injectPilet,
    getGlobalState,
    getExtensions,
    getDependencies,
    getRoutes,
    getPilets,
    setPilets,
    fireEvent,
    integrate,
    createApi,
    loadPilet,
    customSettings = {},
  } = options;
  const events = [];
  const legacyBrowser = !new Error().stack;
  const excludedRoutes = [initialSettings.cataloguePath];
  const selfSource = 'piral-debug-api';
  const debugApiVersion = 'v1';
  const settings: Record<string, DebugCustomSetting> = {
    ...customSettings,
    viewState: {
      value: initialSettings.viewState,
      type: 'boolean',
      label: 'State container logging',
      onChange(value) {
        sessionStorage.setItem('dbg:view-state', value ? 'on' : 'off');
      },
    },
    loadPilets: {
      value: initialSettings.loadPilets,
      type: 'boolean',
      label: 'Load available pilets',
      onChange(value) {
        sessionStorage.setItem('dbg:load-pilets', value ? 'on' : 'off');
      },
    },
    hardRefresh: {
      value: initialSettings.hardRefresh,
      type: 'boolean',
      label: 'Full refresh on change',
      onChange(value) {
        sessionStorage.setItem('dbg:hard-refresh', value ? 'on' : 'off');
      },
    },
    viewOrigins: {
      value: initialSettings.viewOrigins,
      type: 'boolean',
      label: 'Visualize component origins',
      onChange(value, prev) {
        sessionStorage.setItem('dbg:view-origins', value ? 'on' : 'off');

        if (prev !== value) {
          updateVisualize(value);
        }
      },
    },
    extensionCatalogue: {
      value: initialSettings.extensionCatalogue,
      type: 'boolean',
      label: 'Enable extension catalogue',
      onChange(value) {
        sessionStorage.setItem('dbg:extension-catalogue', value ? 'on' : 'off');
      },
    },
  };

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

  const getSettings = () => {
    return Object.keys(settings).reduce((obj, key) => {
      const setting = settings[key];

      if (
        setting &&
        typeof setting === 'object' &&
        typeof setting.label === 'string' &&
        typeof setting.type === 'string' &&
        ['boolean', 'string', 'number'].includes(typeof setting.value)
      ) {
        obj[key] = {
          label: setting.label,
          value: setting.value,
          type: setting.type,
        };
      }

      return obj;
    }, {});
  };

  const updateSettings = (values: Record<string, any>) => {
    Object.keys(values).forEach((key) => {
      const setting = settings[key];

      switch (setting.type) {
        case 'boolean': {
          const prev = setting.value;
          const value = values[key];
          setting.value = value;
          setting.onChange(value, prev);
          break;
        }
        case 'number': {
          const prev = setting.value;
          const value = values[key];
          setting.value = value;
          setting.onChange(value, prev);
          break;
        }
        case 'string': {
          const prev = setting.value;
          const value = values[key];
          setting.value = value;
          setting.onChange(value, prev);
          break;
        }
      }
    });

    sendMessage({
      settings: getSettings(),
      type: 'settings',
    });
  };

  const activatePilet = (pilet: any) => {
    try {
      const { createApi } = options;
      const newApi = createApi(pilet);
      injectPilet(pilet);
      pilet.setup(newApi);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePilet = (name: string) => {
    const pilet: any = getPilets().find((m) => m.name === name);

    if (!pilet) {
      // nothing to do, obviously invalid call
    } else if (pilet.disabled) {
      if (pilet.original) {
        // everything is fine, let's use the cached version
        activatePilet(pilet.original);
      } else {
        // something fishy is going on - let's just try to activate the same pilet
        activatePilet({ ...pilet, disabled: false });
      }
    } else {
      injectPilet({ name, disabled: true, original: pilet } as any);
    }
  };

  const removePilet = (name: string) => {
    const pilets = getPilets().filter((m) => m.name !== name);
    injectPilet({ name } as any);
    setPilets(pilets);
  };

  const appendPilet = (meta: any) => {
    const { loadPilet } = options;
    loadPilet(meta).then(activatePilet);
  };

  const toggleVisualize = () => {
    setState((s) => ({
      ...s,
      visualize: {
        ...s.visualize,
        force: !s.visualize.force,
      },
    }));
  };

  const updateVisualize = (active: boolean) => {
    setState((s) => ({
      ...s,
      visualize: {
        ...s.visualize,
        active,
      },
    }));
  };

  const goToRoute = (path: string, state?: any) => {
    setState((s) => ({
      ...s,
      route: {
        path,
        state,
      },
    }));
  };

  const eventDispatcher = document.body.dispatchEvent;

  const systemResolve = System.constructor.prototype.resolve;
  const depMap: Record<string, Record<string, string>> = {};

  System.constructor.prototype.resolve = function (...args) {
    const [url, parent] = args;
    const result = systemResolve.call(this, ...args);

    if (parent) {
      const deps = depMap[parent] || {};
      deps[url] = result;
      depMap[parent] = deps;
    }

    return result;
  };

  const debugApi = {
    debug: debugApiVersion,
    instance: {
      name: process.env.BUILD_PCKG_NAME,
      version: process.env.BUILD_PCKG_VERSION,
      dependencies: process.env.SHARED_DEPENDENCIES,
    },
    build: {
      date: process.env.BUILD_TIME_FULL,
      cli: process.env.PIRAL_CLI_VERSION,
      compat: process.env.DEBUG_PIRAL,
    },
    pilets: {
      loadPilet,
      createApi,
    },
  };

  const details = {
    name: debugApi.instance.name,
    version: debugApi.instance.version,
    kind: debugApiVersion,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    capabilities: [
      'events',
      'container',
      'routes',
      'pilets',
      'settings',
      'extensions',
      'dependencies',
      'dependency-map',
    ],
  };

  const start = () => {
    const container = decycle(getGlobalState());
    const routes = getRoutes().filter((r) => !excludedRoutes.includes(r));
    const extensions = getExtensions();
    const settings = getSettings();
    const dependencies = getDependencies();
    const pilets = getPilets().map((pilet: any) => ({
      name: pilet.name,
      version: pilet.version,
      disabled: pilet.disabled,
    }));

    sendMessage({
      type: 'available',
      ...details,
      state: {
        routes,
        pilets,
        container,
        settings,
        events,
        extensions,
        dependencies,
      },
    });
  };

  const check = () => {
    sendMessage({
      type: 'info',
      ...details,
    });
  };

  const getDependencyMap = () => {
    const dependencyMap: Record<string, Array<{ demanded: string; resolved: string }>> = {};
    const addDeps = (pilet: string, dependencies: Record<string, string>) => {
      const deps = dependencyMap[pilet] || [];

      for (const depName of Object.keys(dependencies)) {
        if (!deps.some((m) => m.demanded === depName)) {
          deps.push({
            demanded: depName,
            resolved: dependencies[depName],
          });
        }
      }

      dependencyMap[pilet] = deps;
    };
    const pilets = getPilets()
      .map((pilet: any) => ({
        name: pilet.name,
        link: pilet.link,
        base: pilet.base,
      }))
      .filter((m) => m.link);

    Object.keys(depMap).forEach((url) => {
      const dependencies = depMap[url];
      const pilet = pilets.find((p) => p.link === url);

      if (pilet) {
        addDeps(pilet.name, dependencies);
      } else if (!pilet) {
        const parent = pilets.find((p) => url.startsWith(p.base));

        if (parent) {
          addDeps(parent.name, dependencies);
        }
      }
    });

    sendMessage({
      type: 'dependency-map',
      dependencyMap,
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

  window.addEventListener('storage', (event) => {
    if (!legacyBrowser && event.storageArea === sessionStorage) {
      // potentially unknowingly updated settings
      updateSettings({
        viewState: sessionStorage.getItem('dbg:view-state') !== 'off',
        loadPilets: sessionStorage.getItem('dbg:load-pilets') === 'on',
        hardRefresh: sessionStorage.getItem('dbg:hard-refresh') === 'on',
        viewOrigins: sessionStorage.getItem('dbg:view-origins') === 'on',
        extensionCatalogue: sessionStorage.getItem('dbg:extension-catalogue') !== 'off',
      });
    }
  });

  window.addEventListener('message', (event) => {
    const { source, version, content } = event.data;

    if (source !== selfSource && version === debugApiVersion) {
      switch (content.type) {
        case 'init':
          return start();
        case 'check-piral':
          return check();
        case 'get-dependency-map':
          return getDependencyMap();
        case 'update-settings':
          return updateSettings(content.settings);
        case 'append-pilet':
          return appendPilet(content.meta);
        case 'remove-pilet':
          return removePilet(content.name);
        case 'toggle-pilet':
          return togglePilet(content.name);
        case 'emit-event':
          return fireEvent(content.name, content.args);
        case 'goto-route':
          return goToRoute(content.route, content.state);
        case 'visualize-all':
          return toggleVisualize();
      }
    }
  });

  integrate({
    components: {
      Debug: DebugTracker,
    },
    routes: {
      [initialSettings.cataloguePath]: ExtensionCatalogue,
    },
    wrappers: {
      '*': VisualizationWrapper,
    },
    onChange(previous, current, changed) {
      if (changed.state) {
        if (settings.viewState.value) {
          if (!legacyBrowser) {
            // Chrome, Firefox, ... (full capability)
            const err = new Error();
            const lastLine = err.stack.split('\n')[7];

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

        sendMessage({
          type: 'container',
          container: decycle(getGlobalState()),
        });
      }

      if (changed.pilets) {
        sendMessage({
          type: 'pilets',
          pilets: getPilets().map((pilet: any) => ({
            name: pilet.name,
            version: pilet.version,
            disabled: !!pilet.disabled,
          })),
        });
      }

      if (changed.pages) {
        sendMessage({
          type: 'routes',
          routes: getRoutes().filter((r) => !excludedRoutes.includes(r)),
        });
      }

      if (changed.extensions) {
        sendMessage({
          type: 'extensions',
          extensions: getExtensions(),
        });
      }

      if (changed.dependencies) {
        sendMessage({
          type: 'dependencies',
          dependencies: getDependencies(),
        });
      }
    },
  });

  window['dbg:piral'] = debugApi;
  start();
}
