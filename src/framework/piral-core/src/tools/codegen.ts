// this file is bundled, so the references here will not be at runtime (i.e., for a user)
import { getModulePath } from 'piral-cli/src/external/resolve';
import { readFileSync, existsSync } from 'fs';
import { resolve, relative, dirname, sep, posix } from 'path';

function findPackagePath(moduleDir: string) {
  const packageJson = 'package.json';
  const packagePath = resolve(moduleDir, packageJson);

  if (existsSync(packagePath)) {
    return packagePath;
  }

  const newDir = resolve(moduleDir, '..');

  if (newDir !== moduleDir) {
    return findPackagePath(newDir);
  }

  return undefined;
}

function getPackageJson(root: string, packageName: string) {
  const moduleDir = dirname(getModulePath(root, packageName));

  try {
    const packagePath = findPackagePath(moduleDir);
    const content = readFileSync(packagePath, 'utf8');
    return JSON.parse(content) || {};
  } catch {
    return {};
  }
}

const reactRouters = ['react-router', 'react-router-dom'];

function getRouter(root: string) {
  const routers = [...reactRouters, 'wouter'];

  for (const name of routers) {
    try {
      const { version } = getPackageJson(root, name);
      const [major] = version.split('.');
      const compat = parseInt(major, 10);
      return { name, compat };
    } catch {}
  }

  console.warn(`⚠ Could not determine the used router. Falling back to "react-router" v5.`);
  return {
    name: routers[0],
    compat: 5,
  };
}

function getIdentifiers(root: string, packageName: string) {
  const identifiers = [packageName];

  try {
    const details = getPackageJson(root, packageName);

    if (details.version) {
      identifiers.push(`${packageName}@${details.version}`);

      if (details.name && details.name !== packageName) {
        identifiers.push(`${details.name}@${details.version}`);
      }
    }
  } catch {}

  return identifiers;
}

function getModulePathOrDefault(root: string, origin: string, name: string) {
  try {
    const absPath = getModulePath(root, name);
    const relPath = relative(origin, absPath);

    // The relative path is to be used in an import statement,
    // so it should be normalized back to use posix path separators.
    const path = relPath.split(sep).join(posix.sep);
    return path;
  } catch {
    return name;
  }
}

interface CodegenOptions {
  root: string;
  origin: string;
  cat: string;
  appName: string;
  shared: Array<string>;
  externals: Array<string>;
  publicPath: string;
  isolation: 'classic' | 'modern';
  internalStyles: 'inline' | 'sheet' | 'none';
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

export function createBasicAppFunc(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  switch (opts.internalStyles) {
    case 'sheet':
      imports.push(`import 'piral-core/styles/sheet.css';`);
    // no return - we fall through and also include the dummy applyStyle for "none"
    case 'none':
      exports.push(`
        export function applyStyle(element) {}
      `);
      return;
    case 'inline':
    default:
      exports.push(`
        export function applyStyle(element) {
          element.style.display = 'contents';
        }
      `);
      return;
  }
}

export function createDependencies(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { root, appName, externals, shared, origin } = opts;
  const assignments: Array<string> = [];
  const asyncAssignments: Array<string> = [];

  if (appName) {
    const parts = [];

    for (const item of shared) {
      if (typeof item === 'string') {
        const path = getModulePathOrDefault(root, origin, item);
        const ref = `_${imports.length}`;
        parts.push(`...${ref}`);
        imports.push(`import * as ${ref} from ${JSON.stringify(path)}`);
      }
    }

    assignments.push(`deps['${appName}']={${parts.join(',')}}`);
  }

  for (const external of externals) {
    if (external.endsWith('?')) {
      const name = external.replace(/\?+$/, '');
      const identifiers = getIdentifiers(root, name);
      const path = getModulePathOrDefault(root, origin, name);

      for (const id of identifiers) {
        asyncAssignments.push(`registerModule(${JSON.stringify(id)}, () => import(${JSON.stringify(path)}))`);
      }
    } else {
      const name = external;
      const identifiers = getIdentifiers(root, name);
      const path = getModulePathOrDefault(root, origin, name);
      const ref = `_${imports.length}`;
      imports.push(`import * as ${ref} from ${JSON.stringify(path)}`);

      for (const id of identifiers) {
        assignments.push(`deps[${JSON.stringify(id)}]=${ref}`);
      }
    }
  }

  if (asyncAssignments.length) {
    imports.push(`import { registerModule } from 'piral-base'`);
    assignments.push(...asyncAssignments);
  }

  exports.push(`
    export function fillDependencies(deps) {
      ${assignments.join(';')}
    }
  `);
}

export function createDefaultState(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { root, cat, publicPath, isolation } = opts;
  const router = getRouter(root);
  const wrap = isolation === 'modern' ? 'true' : 'false';

  imports.push(
    `import { DefaultErrorInfo } from 'piral-core/${cat}/defaults/DefaultErrorInfo.js';`,
    `import { DefaultLoadingIndicator } from 'piral-core/${cat}/defaults/DefaultLoadingIndicator.js';`,
    `import { DefaultLayout } from 'piral-core/${cat}/defaults/DefaultLayout.js';`,
  );

  if (router.name === 'wouter') {
    // Wouter Router
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_wouter.js';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_wouter.js';`,
      `import { createRedirect, createNavigation, useCurrentNavigation } from 'piral-core/${cat}/defaults/navigator_wouter.js'`,
    );
  } else if (router.compat < 6) {
    // React Router v5
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_v5.js';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_v5.js';`,
      `import { createRedirect, createNavigation, useCurrentNavigation } from 'piral-core/${cat}/defaults/navigator_v5.js'`,
    );
  } else if (router.compat === 6) {
    // React Router v6
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_v6.js';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_v6.js';`,
      `import { createRedirect, createNavigation, useCurrentNavigation } from 'piral-core/${cat}/defaults/navigator_v6.js'`,
    );
  } else {
    // React Router v7
    imports.push(
      `import { DefaultRouter } from 'piral-core/${cat}/defaults/DefaultRouter_v7.js';`,
      `import { DefaultRouteSwitch } from 'piral-core/${cat}/defaults/DefaultRouteSwitch_v7.js';`,
      `import { createRedirect, createNavigation, useCurrentNavigation } from 'piral-core/${cat}/defaults/navigator_v7.js'`,
    );
  }

  exports.push(`
    export { createRedirect, createNavigation };
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
          wrap: ${wrap},
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
    const originalCall = `originalDebugger(context, options, {
      defaultSettings: ${JSON.stringify(debug)},
      emulator: ${JSON.stringify(emulator)},
      ...debug,
    })`;
    imports.push(`import { integrateDebugger as originalDebugger } from "piral-core/${cat}/tools/debugger.js"`);
    exports.push(`export function integrateDebugger(context, options, debug) { return ${originalCall}; }`);
  } else {
    exports.push(`export function integrateDebugger() {}`);
  }

  // if we build the emulator version of piral (shipped to pilets)
  if (emulator) {
    imports.push(`import { integrateEmulator } from "piral-core/${cat}/tools/emulator.js"`);
    exports.push(`export { integrateEmulator }`);
  } else {
    exports.push(`export function integrateEmulator() {}`);
  }
}

export function createRouteHandler(imports: Array<string>, exports: Array<string>, opts: CodegenOptions) {
  const { cat, emulator } = opts;
  const assignments = [];

  imports.push(`import { useGlobalStateContext } from 'piral-core/${cat}/hooks/globalState.js';`);

  assignments.push(`
    useCurrentNavigation();
  `);

  if (emulator) {
    imports.push(`import { useDebugRouteFilter } from 'piral-debug-utils';`);
    assignments.push('return useDebugRouteFilter(paths);');
  } else {
    assignments.push('return paths;');
  }

  exports.push(`
    export function useRouteFilter(paths) {
      ${assignments.join('\n')}
    }
  `);
}
