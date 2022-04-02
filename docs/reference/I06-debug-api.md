---
title: Debug API
description: The included API for debugging.
section: Internals
---

# Debug API

The package `piral-debug-utils` is connecting a Piral instance to other tools such as the [Piral Inspector](https://github.com/smapiot/piral-inspector) which is a browser extension available for [Chrome](https://chrome.google.com/webstore/detail/piral-inspector/ikbpelpjfgmplidagknaaegjhfigcbfl?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/piral-inspector/), [Edge](https://microsoftedge.microsoft.com/addons/detail/piral-inspector/hbdhpkhidilkmkbkklcbjgddbeodibml), and [Opera](https://addons.opera.com/en/extensions/details/piral-inspector/).

You can also either place your own tooling on top of `piral-debug-utils` or create a web app where tools such as Piral Inspector could connect to. In this chapter we'll discuss the **producer** (e.g., `piral-debug-utils`) and **consumer** (e.g., Piral Inspector) side's of the debug API.

## Producer API

The `piral-debug-utils` come with two functions:

- `installPiletEmulator` is used to modify the options handed over to `piral-core` for retrieving pilets primarily from the debug API (e.g., `/$pilet-api`).
- `installPiralDebug` is used to actually connect to the debug utils, e.g., the Piral Inspector

The latter expects options to be handed over which are defined in the following interface:

```ts
interface DebuggerOptions {
  customSettings?: Record<string, {
    label: string;
    type: 'string' | 'number' | 'boolean';
    value: any;
    onChange(newValue: any, prevValue: any): void;
  }>;
  integrate(components: DebugComponents): void;
  getDependencies(): Array<string>;
  fireEvent(name: string, arg: any): void;
  getGlobalState(): any;
  getPilets(): Array<Pilet>;
  getExtensions(): Array<string>;
  getRoutes(): Array<string>;
  addPilet(pilet: PiletEntry): void;
  removePilet(name: string): void;
  updatePilet(data: any): void;
}
```

The `customSettings` can be used to bring additional settings to the debug utilities. In the Piral Inspector they are shown in the settings menu.

The `integrate` function will be used to bring additional components relevant for debugging into the Piral Instance. The `piral-debug-utils` will register different components here, which are used to get notified in case of changes to the state container, to the current route, or bring up additional possibilities such as the extension catalogue.

The `addPilet`, `removePilet`, and `updatePilet` functions are used to add, remove, or update a micro frontend. This is the Piral Inspector's way of actually adding more pilets (e.g., by giving it a feed URL), completely removing a pilet, or toggling (enabling / disabling) it.

All other functions are used to retrieve parts of the current Piral instance state, e.g., `getDependencies` is used to get the list of the centrally shared dependencies.

## Consumer API

The consumer API is driven by message exchange. The message event data comes with the following interface:

```ts
interface DebugEvent {
  source: string; // e.g., the Piral Inspector uses "piral-debug-api"
  version: string; // e.g., "v1"
  content: DebugEventContent;
}
```

These events are retrieved by, e.g., the `piral-debug-utils` using code like:

```ts
// fix to a version of the debug API, e.g., v1
const debugApiVersion = 'v1';

window.addEventListener('message', (event) => {
  const { source, version, content } = event.data;

  if (source !== selfSource && version === debugApiVersion) {
    switch (content.type) {
      // ...
    }
  }
});
```

The actual content follows these types, where the actual interface can be inferred from the `type` field:

```ts
type DebugEventContent =
  | InitDebugEventContent
  | CheckAvailableDebugEventContent
  | GotoRouteDebugEventContent
  | RemovePiletDebugEventContent
  | AppendPiletDebugEventContent
  | TogglePiletDebugEventContent
  | UpdateSettingsDebugEventContent
  | EmitEventDebugEventContent
  | VisualizeAllDebugEventContent
  | GetDependencyMapDebugEventContent
  | CheckPiralDebugEventContent;

interface InitDebugEventContent {
  type: 'init';
}

interface CheckAvailableDebugEventContent {
  type: 'check-available';
}

interface GotoRouteDebugEventContent {
  type: 'goto-route';
  route: string;
  state?: any;
}

interface RemovePiletDebugEventContent {
  type: 'remove-pilet';
  name: string;
}

interface AppendPiletDebugEventContent {
  type: 'append-pilet';
  meta: PiletMetadata;
}

interface TogglePiletDebugEventContent {
  type: 'toggle-pilet';
  name: string;
}

interface UpdateSettingsDebugEventContent {
  type: 'update-settings';
  settings: Record<string, any>;
}

interface EmitEventDebugEventContent {
  type: 'emit-event';
  name: string;
  args: any;
}

interface VisualizeAllDebugEventContent {
  type: 'visualize-all';
}

interface GetDependencyMapDebugEventContent {
  type: 'get-dependency-map';
}

interface CheckPiralDebugEventContent {
  type: 'check-piral';
}
```

Data can also be send in the other direction, which is called a command.

```ts
type DebugCommand =
  | AvailableDebugCommand
  | UnavailableDebugCommand
  | ResultDebugCommand
  | PiletsDebugCommand
  | RoutesDebugCommand
  | SettingsDebugCommand
  | EventsDebugCommand
  | ExtensionsDebugCommand
  | ContainerDebugCommand
  | ReconnectDebugCommand
  | InfoDebugCommand
  | DependencyMapDebugCommand;

interface AvailableDebugCommand {
  type: 'available';
  name: string;
  version: string;
  kind: 'v0' | 'v1';
  mode: 'production' | 'development';
  capabilities: Array<string>;
  state: {
    container?: any;
    events?: Array<PiralEvent>;
    pilets?: Array<{
      name: string;
      version: string;
      disabled?: boolean;
    }>;
    routes?: Array<string>;
    settings?: {
      [name: string]: {
        value: any;
        label: string;
        type: 'boolean' | 'string' | 'number';
      };
    };
    extensions?: Array<string>;
    [name: string]: any;
  };
}

interface UnavailableDebugCommand {
  type: 'unavailable';
}
```
