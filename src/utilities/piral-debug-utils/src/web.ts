import { HTMLAttributes } from 'react';

interface PiralExtensionProps extends HTMLAttributes<{}> {
  name: string;
  params: string;
}

interface PiralPortalProps extends HTMLAttributes<{}> {
  pid: string;
}

interface PiralSlotProps extends HTMLAttributes<{}> {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'piral-extension': React.DetailedHTMLProps<PiralExtensionProps, {}>;
      'piral-portal': React.DetailedHTMLProps<PiralPortalProps, {}>;
      'piral-slot': React.DetailedHTMLProps<PiralSlotProps, {}>;
    }
  }

  interface HTMLElementTagNameMap {
    'piral-extension': HTMLElement & {
      params: any;
      name: string;
      empty: any;
    };
    'piral-portal': HTMLElement;
    'piral-slot': HTMLElement;
  }
}
