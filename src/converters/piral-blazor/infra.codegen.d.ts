declare const config: BlazorBootConfig;

interface BlazorBootConfig {
  url: string;
  satellites: Array<string>;
  noMutation: boolean;
  renderMode: 'webcomponent' | 'projection';
}

export default config;
