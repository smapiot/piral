import { EventEmitter } from './utils';

export interface PortalProps {
  children(content: React.ReactNode): React.ReactElement<any>;
}

/**
 * The PiralInstance component, which is a React functional component combined with an event emitter.
 */
export type PiralInstance = React.FC<PortalProps> & EventEmitter;
