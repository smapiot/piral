# Piral Instance Debugging

The Piral instance comes with several special variables that are can be used when the app shell is either directly in debugging mode, or consumed via the development package ("emulator mode").

## Session Variables

The following session variables are actively used.

| Name               | Values      | Description                                                                | Default |
|--------------------|-------------|----------------------------------------------------------------------------|---------|
| `dbg:hard-refresh` | `off`, `on` | Performs a hard reload when changes to the currently debugged pilet occur. | `off`   |
| `dbg:load-pilets`  | `off`, `on` | Still loads all the "usual" pilets besides the debugged pilet.             | `off`   |
| `dbg:view-state`   | `off`, `on` | Shows the state changes in the browser development console.                | `on`    |

## Window Variables

| Name        | Type            | Description                                      |
|-------------|-----------------|--------------------------------------------------|
| `dbg:piral` | `DebugInstance` | The most crucial information from the app shell. |

The type for the `DebugInstance` looks as follows:

```ts
interface DebugInstance {
  debug: string;
  instance: {
    name: string;
    version: string;
    dependencies: string;
    context: GlobalStateContext;
  },
  build: {
    date: string;
    cli: string;
    compat: string;
  },
  pilets: {
    createApi(meta: PiletMetadata): PiletApi;
    getDependencies(meta: PiletMetadata): Record<string, any>;
    requestPilets(): Promise<Array<PiletMetadata>>;
  };
}
```

The `debug` field contains the version of the `DebugInstance` type. Right now, this is `v0`.
