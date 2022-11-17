---
title: renderHtmlExtension
section: Core Pilet API
---

# `renderHtmlExtension`

The `renderHtmlExtension` function can be used to open an extension slot in a DOM element. This is the generalized way of showing extension components - in non-React contexts.

The `renderHtmlExtension` function requires two arguments:

1. The DOM element to render into
2. The props to provide for rendering the extension components (most importantly, the name of the extension slot)

The type of `renderHtmlExtension` is defined to be:

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

type Disposable = () => void;

/**
 * Renders an extension in a plain DOM component.
 * @param element The DOM element or shadow root as a container for rendering the extension.
 * @param props The extension's rendering props.
 * @return The disposer to clear the extension.
 */
type renderHtmlExtension<TName> = (element: HTMLElement | ShadowRoot, props: ExtensionSlotProps<TName>) => Disposable;
```
