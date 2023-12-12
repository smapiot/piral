import type { HTMLAttributes } from 'react';

export interface PiralComponentProps extends HTMLAttributes<{}> {
  name?: string;
  origin: string;
}

export interface PiralExtensionProps extends HTMLAttributes<{}> {
  name: string;
  params: string;
}

export interface PiralPortalProps extends HTMLAttributes<{}> {
  pid: string;
}

export interface PiralSlotProps extends HTMLAttributes<{}> {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'piral-component': React.DetailedHTMLProps<PiralComponentProps, {}>;
      'piral-extension': React.DetailedHTMLProps<PiralExtensionProps, {}>;
      'piral-portal': React.DetailedHTMLProps<PiralPortalProps, {}>;
      'piral-slot': React.DetailedHTMLProps<PiralSlotProps, {}>;
    }
  }

  interface Window {
    /**
     * Assigns content in form a ReactChild to be rendered later
     * from a foreign container / element in an piral-content
     * child.
     * @param cid The ID of the piral-content node.
     * @param content The ReactChild to be rendered.
     */
    assignContent(cid: string, content: any): void;
  }

  interface HTMLElementTagNameMap {
    'piral-component': HTMLElement & {
      name?: string;
      origin: string;
    };
    'piral-extension': HTMLElement & {
      params: any;
      name: string;
      empty: any;
    };
    'piral-portal': HTMLElement;
    'piral-slot': HTMLElement;
  }
}
