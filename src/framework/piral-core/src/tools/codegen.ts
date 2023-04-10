// this file is bundled, so the references here will not be at runtime (i.e., for a user)
import { getModulePath } from 'piral-cli/src/external/resolve';

function getRouterVersion(root: string) {
  const router = 'react-router';

  try {
    const modulePath = getModulePath(root, `${router}/package.json`);
    const { version } = require(modulePath);
    const [major] = version.split('.');
    return parseInt(major, 10);
  } catch {
    console.warn(`⚠ Could not determine version of ${router}. Falling back to v5.`);
    return 5;
  }
}

function getIdentifiers(root: string, packageName: string) {
  const packageJson = `${packageName}/package.json`;
  const identifiers = [packageName];

  try {
    const modulePath = getModulePath(root, packageJson);
    const details = require(modulePath);

    if (details.version) {
      identifiers.push(`${packageName}@${details.version}`);

      if (details.name !== packageName) {
        identifiers.push(`${details.name}@${details.version}`);
      }
    }
  } catch {}

  return identifiers;
}

function getModulePathOrDefault(root: string, name: string) {
  try {
    return getModulePath(root, name);
  } catch {
    return name;
  }
}

interface CodegenOptions {
  root: string;
  cat: string;
  appName: string;
  externals: Array<string>;
  publicPath: string;
  debug?: {
    viewState?: boolean;
    loadPilets?: boolean;
    hardRefresh?: boolean;
    viewOrigins?: boolean;
    extensionCatalogue?: boolean;
    clearConsole?: boolean;
  };
  emulator: boolean;
}

export function createDependencies(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { root, appName, externals } = opts;
  const assignments: Array<string> = [];

  if (appName) {
    assignments.push(`deps['${appName}']={}`);
  }

  for (const name of externals) {
    const identifiers = getIdentifiers(root, name);
    const path = getModulePathOrDefault(root, name);
    const ref = `_${imports.length}`;
    imports.push(`import * as ${ref} from ${JSON.stringify(path)}`);

    for (const id of identifiers) {
      assignments.push(`deps[${JSON.stringify(id)}]=${ref}`);
    }
  }

  exports.push(`
    export function fillDependencies(deps) {
      ${assignments.join(';')}
    }
  `);
}

export function createDefaultState(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { root, cat, publicPath } = opts;
  const routerVersion = getRouterVersion(root);

  imports.push(
    `import { DefaultErrorInfo } from 'piral-core/${cat}/defaults/DefaultErrorInfo';`,
    `import { DefaultLoadingIndicator } from 'piral-core/${cat}/defaults/DefaultLoadingIndicator';`,
    `import { DefaultLayout } from 'piral-core/${cat}/defaults/DefaultLayout';`,
  );

  if (routerVersion < 6) {
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_v5';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_v5';`,
      `import { createRedirect, createNavigation, useCurrentNavigation, useRouterContext } from 'piral-core/${cat}/defaults/navigator_v5'`,
    );
  } else {
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_v6';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_v6';`,
      `import { createRedirect, createNavigation, useCurrentNavigation, useRouterContext } from 'piral-core/${cat}/defaults/navigator_v6'`,
    );
  }

  exports.push(`
    export { createRedirect, createNavigation, useRouterContext };
  `);

  exports.push(`
    export const publicPath = ${JSON.stringify(publicPath)};
  `);

  exports.push(`
    export function createDefaultState() {
      return {
        app: {
          error: undefined,
          loading: typeof window !== 'undefined',
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          LoadingIndicator: DefaultLoadingIndicator,
          Router: DefaultRouter,
          RouteSwitch: DefaultRouteSwitch,
          Layout: DefaultLayout,
        },
        errorComponents: {},
        registry: {
          extensions: {},
          pages: {},
          wrappers: {},
        },
        routes: {},
        data: {},
        portals: {},
        modules: [],
      };
    }
  `);
}

export function createDebugHandler(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { cat, debug, emulator } = opts;

  // if we build the debug version of piral (debug and emulator build)
  if (debug) {
    const originalCall = `originalDebugger(context, options, { defaultSettings: ${JSON.stringify(debug)}, ...debug })`;
    imports.push(`import { integrateDebugger as originalDebugger } from "piral-core/${cat}/tools/debugger"`);
    exports.push(`export function integrateDebugger(context, options, debug) { return ${originalCall}; }`);
  } else {
    exports.push(`export function integrateDebugger() {}`);
  }

  // if we build the emulator version of piral (shipped to pilets)
  if (emulator) {
    imports.push(`import { integrateEmulator } from "piral-core/${cat}/tools/emulator"`);
    exports.push(`export { integrateEmulator }`);
  } else {
    exports.push(`export function integrateEmulator() {}`);
  }
}

export function createRouteHandler(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { cat, emulator } = opts;
  const assignments = [];

  imports.push(`import { useGlobalStateContext } from 'piral-core/${cat}/hooks/globalState';`);

  assignments.push(`
    useCurrentNavigation();
  `);

  if (emulator) {
    imports.push(`import { debugRouteFilter } from 'piral-debug-utils';`);
    assignments.push('return debugRouteFilter(paths);');
  } else {
    assignments.push('return paths;');
  }

  exports.push(`
    export function useRouteFilter(paths) {
      ${assignments.join('\n')}
    }
  `);
}
