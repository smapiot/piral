/**
 * Props for defining an extension slot.
 */
export interface ExtensionSlotProps<T = any> {
  /**
   * Defines what should be rendered when no components are available
   * for the specified extension.
   */
  empty?(): React.ReactNode;
  /**
   * Defines how the provided nodes should be rendered.
   * @param nodes The rendered extension nodes.
   */
  render?(nodes: Array<React.ReactNode>): React.ReactElement<any, any> | null;
  /**
   * The custom parameters for the given extension.
   */
  params?: T;
  /**
   * The name of the extension to render.
   */
  name: string;
}
