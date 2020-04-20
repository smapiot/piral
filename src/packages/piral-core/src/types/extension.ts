import { PiralCustomExtensionSlotMap } from './custom';

export interface PiralExtensionSlotMap extends PiralCustomExtensionSlotMap {
  [name: string]: any;
}

/**
 * Props for defining an extension slot.
 */
export type ExtensionSlotProps = {
  [T in keyof PiralExtensionSlotMap]: {
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
    params?: PiralExtensionSlotMap[T];
    /**
     * The name of the extension to render.
     */
    name: T;
  }
}[keyof PiralExtensionSlotMap];
