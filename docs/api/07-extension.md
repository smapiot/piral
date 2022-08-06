---
title: Extension
section: Core Pilet API
---

# `Extension`

The `Extension` function is a React component that renders an extension slot for the provided props. An extension slot renders all extension components that have been provided for its given `name`.

The `Extension` component requires at least one prop:

1. The `name` of the extension slot to render

The type of `Extension` is defined to be:

```ts
interface BaseExtensionSlotProps<TName, TParams> {
  /**
   * The children to transport, if any.
   */
  children?: ReactNode;
  /**
   * Defines what should be rendered when no components are available
   * for the specified extension.
   */
  empty?(): ReactNode;
  /**
   * Determines if the `render` function should be called in case no
   * components are available for the specified extension.
   *
   * If true, `empty` will be called and returned from the slot.
   * If false, `render` will be called with the result of calling `empty`.
   * The result of calling `render` will then be returned from the slot.
   */
  emptySkipsRender?: boolean;
  /**
   * Defines the order of the components to render.
   * May be more convient than using `render` w.r.t. ordering extensions
   * by their supplied metadata.
   * @param extensions The registered extensions.
   * @returns The ordered extensions.
   */
  order?(extensions: Array<ExtensionRegistration>): Array<ExtensionRegistration>;
  /**
   * Defines how the provided nodes should be rendered.
   * @param nodes The rendered extension nodes.
   * @returns The rendered nodes, i.e., an ReactElement.
   */
  render?(nodes: Array<ReactNode>): ReactElement<any, any> | null;
  /**
   * The custom parameters for the given extension.
   */
  params?: TParams;
  /**
   * The name of the extension to render.
   */
  name: TName;
}

type ExtensionSlotProps<TName = string> = BaseExtensionSlotProps<
  TName extends string ? TName : string,
  ExtensionParams<TName>
>;

/**
 * React component for displaying extensions for a given name.
 * @param props The extension's rendering props.
 * @return The created React element.
 */
type Extension<TName> = (props: ExtensionSlotProps<TName>) => ReactElement | null;
```
