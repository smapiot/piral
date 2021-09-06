interface PiralExtensionProps {
  name: string;
  params: string;
}

declare module JSX {
  interface IntrinsicElements {
    'piral-extension': React.DetailedHTMLProps<PiralExtensionProps, {}>;
  }
}
